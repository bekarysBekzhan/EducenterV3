import notifee, { EventType } from "@notifee/react-native"

export class LocalNotificationService {

    static onDisplayNotification = async(message) => {

        await notifee.requestPermission()

        await notifee.createChannel({
            id: "default",
            name: "Default Channel"
        })

        return await notifee.displayNotification({
            title: message?.notification?.title,
            body: message?.notification?.body,
            android: {
              channelId : "default",
              sound: message?.notification?.android?.sound,
              pressAction: {
                id: 'default',
              },
            },
        });
    }

    static cancel = async(notificationId) => {
        await notifee.cancelNotification(notificationId);
    }

    static onForeground = notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
            case EventType.DISMISSED:
              console.log('User dismissed notification', detail.notification);
              break;
            case EventType.PRESS:
              console.log('User pressed notification', detail.notification);
              console.log('type', type);
              if (detail?.notification) {

              }
              break;
        }
    })

}