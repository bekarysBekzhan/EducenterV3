import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

class FirebaseService {
  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      this.getToken();
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
    }
  }

  async deleteToken() {
    await messaging().deleteToken()
  }
}

export const firebaseService = new FirebaseService();
