import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { navigate } from '../components/navigation/RootNavigation';
import { ROUTE_NAMES } from '../components/navigation/routes';
import { NOTIFICATION_TYPE, STORAGE } from '../constans/constants';
import { getString, storeString } from "../storage/AsyncStorage"
import { MobileSettingsService } from './API';
import { LocalNotificationService } from './LocalNotificationService';

class FirebaseService {

  async register() {
    this.checkPermission()
    this.createNoitificationListeners()
  }

  async registerAppWithFCM() {
    if (Platform.OS === 'ios') {
      // await messaging().registerDeviceForRemoteMessages()
      await messaging().setAutoInitEnabled(true)
    }
  }

  async setFCMToken(fcmToken, bearerToken) {
    await MobileSettingsService.setFCMToken(fcmToken, bearerToken)
  }

  async onRegister(token) {
    const string = await getString("token")
    if (string) {
      this.setFCMToken(token, string)
    }
  }

  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      this.getToken();
    } else {
      console.log("Requested permission rejected!")
    }
  }

  async checkPermission() {

    const isAllowed = await messaging().hasPermission();

    if (isAllowed) {
      this.getToken();
    } else {
      this.requestUserPermission();
    }
  }

  async getToken() {
    const token = await messaging().getToken();
    if (token) {
      await storeString(STORAGE.firebaseToken, token)
      this.onRegister(token)
    } else {
      console.log("User does not have a device token.")
    }
  }

  createNoitificationListeners() {

    this.unsubscribe = messaging().onMessage(async(remoteMessage) => {
      console.log("onMessage: " , remoteMessage)
      LocalNotificationService.onDisplayNotification(remoteMessage)
    })

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("onNotificationOpenedApp : " , remoteMessage)
      const notificationData = remoteMessage?.data
      if (notificationData?.type === NOTIFICATION_TYPE.news) {
        navigate(ROUTE_NAMES.newsDetail, { newsId: notificationData?.id })
      } else {
        navigate(ROUTE_NAMES.bottomTab)
      }
    })

    messaging().onTokenRefresh(fcmToken => {
      console.log('messaging().onTokenRefresh', fcmToken);
      this.onRegister(fcmToken);
    })
  }

  async getInitialNotification() {
    const initialNotification = await messaging().getInitialNotification()
    return initialNotification
  }

  async deleteToken() {
    await messaging().deleteToken()
  }

  async unsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}

export const firebaseService = new FirebaseService();
