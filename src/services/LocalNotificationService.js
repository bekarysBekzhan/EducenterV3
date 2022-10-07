import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import {navigate} from '../components/navigation/RootNavigation';
import {ROUTE_NAMES} from '../components/navigation/routes';
import {APP_COLORS, NOTIFICATION_TYPE, STORAGE} from '../constans/constants';
import {storeObject} from '../storage/AsyncStorage';

export class LocalNotificationService {
  static onDisplayNotification = async message => {
    console.log("onDisplayNotification: " , message)
    await storeObject(STORAGE.isRead, false);

    if (global?.setIsRead) {
      global?.setIsRead(false);
    }

    await notifee.requestPermission();

    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
    });

    return await notifee.displayNotification({
      title: message?.notification?.title,
      body: message?.notification?.body,
      data: message?.data,
      android: {
        channelId: 'default',
        sound: message?.notification?.android?.sound,
        pressAction: {
          id: 'default',
        },
        color: APP_COLORS.primary,
      },
    });
  };

  static cancel = async notificationId => {
    await notifee.cancelNotification(notificationId);
  };

  static onForeground = notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        const notificationData = detail?.notification?.data;
        if (notificationData?.type === NOTIFICATION_TYPE.news) {
          navigate(ROUTE_NAMES.newsDetail, {newsId: notificationData?.id, onNotification: true});
        } else {
          navigate(ROUTE_NAMES.bottomTab, { onNotification: true });
        }
        break;
    }
  });
}
