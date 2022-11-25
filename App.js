import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from './src/components/context/Provider';
import Navigation from './src/components/navigation/MainStack';
import ToastView from './src/components/view/ToastView';
import Toast from 'react-native-toast-message';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {firebaseService} from './src/services/FirebaseService';
import {LocalNotificationService} from './src/services/LocalNotificationService';
import codePush from 'react-native-code-push';

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
    firebaseService.register();
    firebaseService.registerAppWithFCM();
    return () => {
      deinitPlayer();
      firebaseService.unsubscribe();
      LocalNotificationService.onForeground();
    };
  }, []);

  const initPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        compactCapabilities: [Capability.Play, Capability.Pause],
        // stoppingAppPausesPlayback: true,
        android: {appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback}
      });
    } catch (e) {
      if (
        e?.message?.includes(
          'The player has already been initialized via setupPlayer',
        )
      ) {
        return Promise.resolve();
      }

      return Promise.reject(e);
    }
  };

  const toastConfig = {
    error: ({text2}) => <ToastView text={text2} />,
  };

  const deinitPlayer = async () => {
    // await TrackPlayer.destroy();
    await TrackPlayer.reset();
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

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

export default codePush(codePushOptions)(App);
