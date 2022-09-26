import React, {useEffect} from 'react';
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

const events = [
  Event.PlaybackError,
  Event.PlaybackState,
  Event.PlaybackTrackChanged,
  Event.PlaybackProgressUpdated,
  Event.PlaybackQueueEnded,
];

const App = () => {

  useEffect(() => {
    // Initialize player
    initPlayer();
    // Firebase Messaging Service
    firebaseService.register()
    firebaseService.registerAppWithFCM()
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
