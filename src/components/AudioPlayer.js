import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import RowContainer from './RowContainer';
import Slider from '@react-native-community/slider';
import { setFontStyle } from '../../util/fontStyle';
import { THEME } from '../../constants/theme';
import SvgPlay from '../../assets/svg/ic_play.svg';
import SvgPause from '../../assets/svg/ic_pause.svg';

const AudioPlayer = ({
    style,
    playStyle,
    positionStyle,
    durationStyle
}) => {

    const memoStyle = useMemo(() => [styles.view, style], []);

    const memoPlayStyle = useMemo(() => [styles.play, playStyle], []);

    const memoPositionStyle = useMemo(() => [styles.position, positionStyle], []);

    const memoDurationStyle = useMemo(() => [styles.duration, durationStyle], []);

    const refToggle = useRef(false);

    const progress = useProgress();

    const secondsToHms = useCallback((d) => {
        d = Number(d);
        let h = Math.floor(d / 3600);
        let m = Math.floor(d % 3600 / 60);
        let s = Math.floor(d % 3600 % 60);

        let hDisplay;
        if (h > 0) { if (h < 10) { hDisplay = "0" + h; } else { hDisplay = h; } } else { hDisplay = "00"; }
        let mDisplay;
        if (m > 0) { if (m < 10) { mDisplay = "0" + m; } else { mDisplay = m; } } else { mDisplay = "00"; }
        let sDisplay;
        if (s > 0) { if (s < 10) { sDisplay = "0" + s; } else { sDisplay = s; } } else { sDisplay = "00"; }
        return hDisplay + ":" + mDisplay + ":" + sDisplay;
    }, []);

    const onValueChange = useCallback(async value => {

        if (State.Paused == await TrackPlayer.getState()) {

            refToggle.current = false;
            await TrackPlayer.seekTo(value);
            await TrackPlayer.pause();

        } else if (State.Playing == await TrackPlayer.getState()) {

            refToggle.current = true;
            await TrackPlayer.seekTo(value);
            await TrackPlayer.play();

        }

    }, []);

    const onSlidingComplete = useCallback(async value => {

        if (State.Paused == await TrackPlayer.getState()) {

            refToggle.current = false;
            await TrackPlayer.seekTo(value);
            await TrackPlayer.pause();

        } else if (State.Playing == await TrackPlayer.getState()) {

            refToggle.current = true;
            await TrackPlayer.seekTo(value);
            await TrackPlayer.play();

        }

    }, []);

    const onPlay = async () => {

        try {

            if (progress.position >= progress.duration) {

                console.log('reset');
                refToggle.current = true;
                await TrackPlayer.seekTo(0);
                await TrackPlayer.play();

            } else if (State.Playing == await TrackPlayer.getState()) {

                console.log('pause');
                refToggle.current = false;
                await TrackPlayer.pause();

            } else {

                console.log('play')
                refToggle.current = true;
                await TrackPlayer.play();

            }
        }
        catch (e) {
            let track = await TrackPlayer.getQueue();
            if (track.length) {
                refToggle.current = false;
                await TrackPlayer.stop();
            }
        }

    };

    const endAudio = async () => {
        try {
            if (progress.position >= progress.duration) {
                refToggle.current = false;
            } else if (State.Playing == await TrackPlayer.getState()) {
                refToggle.current = true;
            }
        }
        catch (e) {
            let track = await TrackPlayer.getQueue();
            if (track.length) {
                refToggle.current = false;
                await TrackPlayer.stop();
            }
        }

    };

    endAudio();

    useEffect(() => {

        return async () => {

            const track = await TrackPlayer.getQueue();

            if (track.length) {
                await TrackPlayer.stop();
                await TrackPlayer.reset();
            }

        }

    }, []);

    return (
        <RowContainer style={memoStyle}>

            <TouchableOpacity
                style={memoPlayStyle}
                activeOpacity={0.9}
                onPress={onPlay}
            >
                {
                    refToggle.current ?
                        <SvgPause />
                        :
                        <SvgPlay />
                }
            </TouchableOpacity>

            <View style={styles.playerView}>
                <RowContainer style={styles.infoPlayerView}>
                    <Text style={memoPositionStyle}>{secondsToHms(progress.position)}</Text>
                    <Text style={memoDurationStyle}>{secondsToHms(progress.duration)}</Text>
                </RowContainer>
                <Slider
                    maximumValue={progress.duration}
                    value={progress.position}
                    onValueChange={onValueChange}
                    onSlidingComplete={onSlidingComplete}
                    thumbTintColor={THEME.primary}
                    minimumTrackTintColor={THEME.primary}
                    maximumTrackTintColor={THEME.maximumTrackTintColor}
                />
            </View>
        </RowContainer>
    )
};

const styles = StyleSheet.create({
    view: {
        marginBottom: 16,
        padding: 10,
        backgroundColor: THEME.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: THEME.border
    },
    play: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: THEME.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    playerView: {
        flex: 1
    },
    infoPlayerView: {
        backgroundColor: THEME.transparent,
        justifyContent: 'space-between'
    },
    position: {
        ...setFontStyle(13)
    },
    duration: {
        ...setFontStyle(13)
    }
});

export default AudioPlayer;
