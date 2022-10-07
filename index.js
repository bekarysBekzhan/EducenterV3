/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';
import {  storeObject  } from './src/storage/AsyncStorage';
import { STORAGE } from './src/constans/constants';
import { PlaybackService } from './src/services/trackPlayerService';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await storeObject(STORAGE.isRead, false);
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() =>
  PlaybackService
);
