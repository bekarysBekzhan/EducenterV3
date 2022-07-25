import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import RowView from './view/RowView';
import { ColorApp } from '../constans/ColorApp';
import { setFontStyle } from '../utils/setFontStyle';

const AudioPlayer = ({
    url,
    index,
    style,
    playStyle,
    positionStyle,
    durationStyle
}) => {


    const memoStyle = useMemo(() => [styles.view, style], []);
    const memoPlayStyle = useMemo(() => [styles.play, playStyle], []);
    const memoPositionStyle = useMemo(() => [styles.position, positionStyle], []);
    const memoDurationStyle = useMemo(() => [styles.duration, durationStyle], []);


    const progress = useProgress();
    const [audio, setAudio] = useState(null)

    useEffect(() => {

        console.log("Audio url : " , url)

        return () => {

        }

    }, []);

    const play = () => {
        
    }

    return (
        <RowView style={memoStyle}>

            <TouchableOpacity
                style={memoPlayStyle}
                activeOpacity={0.9}
                onPress={play}
            >
                
            </TouchableOpacity>

            <View style={styles.playerView}>
                <RowView style={styles.infoPlayerView}>
                    <Text style={memoPositionStyle}>{progress.duration}</Text>
                    <Text style={memoDurationStyle}>{progress.duration}</Text>
                </RowView>
                <Slider
                    maximumValue={progress.duration}
                    value={progress.position}
                    onValueChange={() => {}}
                    onSlidingComplete={() => {}}
                    thumbTintColor={ColorApp.primary}
                    minimumTrackTintColor={ColorApp.primary}
                    maximumTrackTintColor={"red"}
                />
            </View>
        </RowView>
    )
};

const styles = StyleSheet.create({
    view: {
        marginBottom: 16,
        padding: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: ColorApp.placeholder
    },
    play: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: ColorApp.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    playerView: {
        flex: 1
    },
    infoPlayerView: {
        backgroundColor: ColorApp.transparent,
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
