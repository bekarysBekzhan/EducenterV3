import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from './src/components/context/Provider';
import Navigation from './src/components/navigation/MainStack';
import ToastView from './src/components/view/ToastView';
import Toast from 'react-native-toast-message';
import TrackPlayer, {
  Capability,
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {firebaseService} from './src/services/FirebaseService';
import {LocalNotificationService} from './src/services/LocalNotificationService';
import { PermissionsAndroid, Platform } from 'react-native';

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

    if (Platform.OS === 'android') {
      requestAndroidPermissions();
    }

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
        stoppingAppPausesPlayback: true,
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

  const requestAndroidPermissions = async() => {
    try {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      console.log('write external stroage', grants);

      if (
        grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permissions granted');
      } else {
        console.log('All required permissions not granted');
        return;
      }
    } catch (err) {
      console.warn(err);
      return;
    }
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
