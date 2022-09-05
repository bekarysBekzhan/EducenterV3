import React, { useEffect, useLayoutEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from './src/components/context/Provider';
import Navigation from './src/components/navigation/MainStack';
import ToastView from './src/components/view/ToastView';
import Toast from 'react-native-toast-message';
import TrackPlayer, {
  Capability,
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';

const events = [
  Event.PlaybackError,
  Event.PlaybackState,
  Event.PlaybackTrackChanged,
  Event.PlaybackProgressUpdated,
  Event.PlaybackQueueEnded,
];

const App = () => {
  const initPlayer =  () => {
     TrackPlayer.setupPlayer();
  };

  const toastConfig = {
    error: ({ text2 }) => <ToastView text={text2} />,
  };

  const deinitPlayer =  () => {
     TrackPlayer.reset()
  };

  useTrackPlayerEvents(events, () => {
    console.log();
  });

  useLayoutEffect(() => {
    initPlayer();
    // return () => {
    //   deinitPlayer();
    // };
  }, []);

  useEffect(() => {
    TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop
      ]
    })
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider>
        <Navigation />
        <Toast config={toastConfig} />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
