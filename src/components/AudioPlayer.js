import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TrackPlayer, {
  State,
  useProgress,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import RowView from './view/RowView';
import {APP_COLORS} from '../constans/constants';
import {setFontStyle} from '../utils/utils';
import {PauseIcon, PlayIcon} from '../assets/icons';
import {getFormattedTime} from '../utils/utils';

const events = [Event.PlaybackState, Event.PlaybackProgressUpdated];

const AudioPlayer = ({
  _index,
  url,
  onTrackChange,
  style,
  playStyle,
  playIconSize = 1,
  pauseIconSize = 1,
  sliderStyle,
  positionStyle,
  durationStyle,
  minimumTrackTintColor = APP_COLORS.primary,
  maximumTrackTintColor = '#F1F2FE',
}) => {
  const memoStyle = useMemo(() => [styles.view, style], [style]);
  const memoPlayStyle = useMemo(() => [styles.play, playStyle], [playStyle]);
  const memoPositionStyle = useMemo(
    () => [styles.position, positionStyle],
    [positionStyle],
  );
  const memoDurationStyle = useMemo(
    () => [styles.duration, durationStyle],
    [durationStyle],
  );
  const memoSliderStyle = useMemo(
    () => [styles.slider, sliderStyle],
    [sliderStyle],
  );

  useTrackPlayerEvents(events, event => {
    console.log(event);
    if (event.type === Event.PlaybackState) {
      setPlaying(event.state === State.Playing);
      setDuration(progress.duration);
      setPosition(progress.position);
    }
  });

  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(null);

  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const progress = useProgress();

  useEffect(() => {
    add();
  }, []);

  useEffect(() => {
    if (progress.position === progress.duration) {
      console.log('Audio finished.');
      audioFinished();
    }
  }, [progress.position]);

  const add = async () => {
    const track = {
      id: _index,
      url: url,
      title: 'track ' + _index,
      artist: 'artist ' + _index,
    };

    let trackIndex = await TrackPlayer.add(track);

    setIndex(trackIndex);

    if (trackIndex === 0) {
      onTrackChange(duration, setDuration, setPosition, setPlaying);
    }

    let tracks = await TrackPlayer.getQueue();
  };

  const play = async () => {
    if (playing || index === null) {
      return;
    }

    let currentIndex = await TrackPlayer.getCurrentTrack();

    if (currentIndex !== index) {
      TrackPlayer.skip(index).then(async res => {
        await TrackPlayer.play();
      });
    } else {
      await TrackPlayer.play();
    }

    if (currentIndex !== index) {
      onTrackChange(progress.duration, setDuration, setPosition, setPlaying);
    }

    setPlaying(true);
  };

  const pause = async () => {
    if (!playing) {
      return;
    }

    let currentIndex = await TrackPlayer.getCurrentTrack();

    if (currentIndex != index) {
      TrackPlayer.skip(index)
        .then(async res => {
          await TrackPlayer.pause();
        })
        .catch(err => {
          console.warn(err);
        });
    } else {
      await TrackPlayer.pause();
    }

    setPosition(progress.position);
    setDuration(progress.duration);
    setPlaying(false);
  };

  const onSlidingComplete = useCallback(async value => {
    if (State.Paused == (await TrackPlayer.getState())) {
      setPlaying(false);
      await TrackPlayer.seekTo(value);
      await TrackPlayer.pause();
    } else if (State.Playing == (await TrackPlayer.getState())) {
      setPlaying(true);
      await TrackPlayer.seekTo(value);
      await TrackPlayer.play();
    }
  }, []);

  const audioFinished = async () => {
    setPlaying(false);
    await TrackPlayer.seekTo(0);
  };

  return (
    <RowView style={memoStyle}>
      {playing ? (
        <TouchableOpacity
          style={memoPlayStyle}
          activeOpacity={0.9}
          onPress={pause}>
          <PauseIcon size={1.2 * pauseIconSize} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.play, {paddingLeft: 2}]}
          activeOpacity={0.9}
          onPress={play}>
          <PlayIcon size={1.2 * playIconSize} />
        </TouchableOpacity>
      )}

      <View style={styles.playerView}>
        <RowView style={styles.infoPlayerView}>
          <Text style={memoPositionStyle}>
            {getFormattedTime(playing ? progress.position : position)}
          </Text>
          <Text style={memoDurationStyle}>
            {getFormattedTime(playing ? progress.duration : duration)}
          </Text>
        </RowView>
        <Slider
          maximumValue={playing ? progress.duration : duration}
          value={playing ? progress.position : position}
          style={memoSliderStyle}
          onSlidingComplete={onSlidingComplete}
          thumbTintColor={APP_COLORS.primary}
          minimumTrackTintColor={minimumTrackTintColor}
          maximumTrackTintColor={maximumTrackTintColor}
        />
      </View>
    </RowView>
  );
};

const styles = StyleSheet.create({
  view: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  play: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playerView: {
    flex: 1,
  },
  infoPlayerView: {
    backgroundColor: APP_COLORS.transparent,
    justifyContent: 'space-between',
  },
  slider: {},
  position: {
    ...setFontStyle(13),
  },
  duration: {
    ...setFontStyle(13),
  },
});

export default AudioPlayer;
