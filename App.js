import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from './src/components/context/Provider';
import Navigation from './src/components/navigation/MainStack';
import ToastView from './src/components/view/ToastView';
import Toast from 'react-native-toast-message';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { firebaseService } from './src/services/FirebaseService';
import { LocalNotificationService } from './src/services/LocalNotificationService';
import { NOTIFICATION_TYPE } from './src/constans/constants';
import { navigate } from './src/components/navigation/RootNavigation';
import { ROUTE_NAMES } from './src/components/navigation/routes';

const events = [
  Event.PlaybackError,
  Event.PlaybackState,
  Event.PlaybackTrackChanged,
  Event.PlaybackProgressUpdated,
  Event.PlaybackQueueEnded,
];

const App = () => {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize player
    initPlayer();
    // Firebase Messaging Service
    firebaseService.register()
    firebaseService.registerAppWithFCM()
    firebaseService.getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
        const notificationData = remoteMessage?.data
        if (notificationData?.type === NOTIFICATION_TYPE.news) {
          navigate(ROUTE_NAMES.newsDetail, { newsId: notificationData?.id })
        } else {
          navigate(ROUTE_NAMES.bottomTab)
        }
      }
      setLoading(false)
    })
    return () => {
      deinitPlayer();
      firebaseService.unsubscribe()
      LocalNotificationService.onForeground()
    };
  }, []);
  
  const initPlayer = async () => {
    await TrackPlayer.setupPlayer();
  };

  const toastConfig = {
    error: ({text2}) => <ToastView text={text2} />,
  };

  const deinitPlayer = async () => {
    // await TrackPlayer.destroy();
  };

  useTrackPlayerEvents(events, () => {
    console.log();
  });

  if (loading) {
    return null
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
        <Provider>
          <Navigation />
          <Toast config={toastConfig} />
        </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
