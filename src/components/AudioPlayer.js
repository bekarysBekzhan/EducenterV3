import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TrackPlayer, { State, useProgress, useTrackPlayerEvents, Event } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import RowView from './view/RowView';
import { ColorApp } from '../constans/ColorApp';
import { setFontStyle } from '../utils/utils';
import { iconPause, iconPlay } from '../assets/icons';
import { getFormattedTime } from '../utils/utils';

const AudioPlayer = ({
    url,
    style,
    playStyle,
    positionStyle,
    durationStyle
}) => {

    const memoStyle = useMemo(() => [styles.view, style], []);
    const memoPlayStyle = useMemo(() => [styles.play, playStyle], []);
    const memoPositionStyle = useMemo(() => [styles.position, positionStyle], []);
    const memoDurationStyle = useMemo(() => [styles.duration, durationStyle], []);


    const [playing, setPlaying] = useState(false)
    const [index, setIndex] = useState(null)
    const progress = useProgress()

    useEffect(() => {

        add()

    }, []);

    const add = async() => {
        console.log("Audio url : " , url)

        let index = (await TrackPlayer.getQueue()).length

        const track = {
            url: url,
            title: "track " + index,
            artist: "artist " + index
        }

        await TrackPlayer.add(track)

        setIndex(index)
        
        let tracks = await TrackPlayer.getQueue()

        console.log("tracks : ", tracks)

    }

    const play = async() => {
        if(playing || index === null) {
            return
        }
        let currentIndex = await TrackPlayer.getCurrentTrack()
        if(currentIndex !== index){
            await TrackPlayer.skip(index)
        }
        TrackPlayer.play()
        setPlaying(true)
    }

    const pause = async() => {
        if(!playing) {
            return
        }
        let currentIndex = await TrackPlayer.getCurrentTrack()
        if(currentIndex != index){
            await TrackPlayer.skip(index)
        }
        TrackPlayer.pause()
        setPlaying(false)
    }


    return (
        <RowView style={memoStyle}>

            {
                playing
                ?
                <TouchableOpacity
                    style={memoPlayStyle}
                    activeOpacity={0.9}
                    onPress={pause}
                >
                    {iconPause(1.2)}
                </TouchableOpacity>
                :
                <TouchableOpacity
                    style={[styles.play, {paddingLeft: 2}]}
                    activeOpacity={0.9}
                    onPress={play}
                >
                    {iconPlay(1.2)}
                </TouchableOpacity>
            }

            <View style={styles.playerView}>
                <RowView style={styles.infoPlayerView}>
                    <Text style={memoPositionStyle}>{getFormattedTime(progress.position)}</Text>
                    <Text style={memoDurationStyle}>{getFormattedTime(progress.duration)}</Text>
                </RowView>
                <Slider
                    maximumValue={progress.duration}
                    value={progress.position}
                    onValueChange={() => {}}
                    onSlidingComplete={() => {}}
                    thumbTintColor={ColorApp.primary}
                    minimumTrackTintColor={ColorApp.primary}
                    maximumTrackTintColor={"#F1F2FE"}
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
