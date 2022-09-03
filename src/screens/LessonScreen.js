import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import UniversalView from '../components/view/UniversalView'
import { useEffect } from 'react'
import { useFetching } from '../hooks/useFetching'
import { CourseService } from '../services/API'
import { useState } from 'react'
import { APP_COLORS, WIDTH } from '../constans/constants'
import HtmlView from '../components/HtmlView'
import { setFontStyle } from '../utils/utils'
import RowView from '../components/view/RowView'
import OutlineButton from '../components/button/OutlineButton'
import { strings } from '../localization'
import { LeftIcon, RightIcon } from '../assets/icons'
import { ROUTE_NAMES } from '../components/navigation/routes'
import { useIsCaptured } from 'react-native-is-screen-captured-ios'
import AudioPlayer from '../components/AudioPlayer'
import TrackPlayer from 'react-native-track-player'
import Overlay from '../components/view/Overlay'
import FileItem from '../components/FileItem'

const LessonScreen = (props) => {

    const id = props.route?.params?.id
    const chapterTitle = props.route?.params?.title

    const [data, setData] = useState(null)
    const [isModal, setIsModal] = useState(false)
    const isCaptured = useIsCaptured()
    const [fetchLesson, isLoading, lessonError] = useFetching(async() => {
        const response = await CourseService.fetchLesson(id)
        setData(response.data?.data)
    })

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: chapterTitle ? chapterTitle : strings.урок
        })
    }, [])

    useEffect(() => {
        if(lessonError) {
            if (lessonError?.status !== 200) {
                props.navigation.goBack()
                return
            }
        }
    }, [lessonError])

    useEffect(() => {
        fetchLesson()

        return async() => {
            await TrackPlayer.reset()
        }
    }, [])

    const nextLessonTapped = async() => {

        if(data?.isLast) {
            return
        }

        setIsModal(true)

        try {
            const response = await CourseService.fetchLesson(data?.next_lesson_id)
            if (response.status === 200) {
                if(data?.isLast) {
                    props.navigation.navigate("")
                    return
                }
                props.navigation.replace(ROUTE_NAMES.lesson, { id: data?.next_lesson_id })
            }
        } catch(e) {
            console.log(e)
        }

        setIsModal(false)

    }

    const previousLessonTapped = () => {
        if(data?.isFirst) {
            return
        }

        props.navigation.replace(ROUTE_NAMES.lesson, { id: data?.previous_lesson_id })
    }

    return (
        <UniversalView>
            <UniversalView haveScroll style={styles.container}>
                {
                    isLoading
                    ?
                    <ActivityIndicator style={styles.indicator} color={APP_COLORS.primary}/>
                    :
                    isCaptured
                    ?
                    <UniversalView
                        style={styles.isCapturedContainer}
                    >
                    </UniversalView>
                    :
                    <View>
                        <View style={styles.video}>
                            <HtmlView
                                html={data?.video}
                            />
                        </View>
                        <Text style={styles.title}>{data?.title}</Text>
                        {
                            data?.audio
                            ?
                            <AudioPlayer
                                _index={1}
                                url={data?.audio}
                                onTrackChange={() => undefined}  
                                style={{ padding: 0}}               
                            />
                            :
                            null
                        }
                        {
                            data?.files.map((file, index) => (
                                <FileItem 
                                    fileName={file?.file_name}
                                    urlFile={file?.link} 
                                    style={{ marginVertical: 16}}
                                    key={index}
                                />
                            ))
                        }
                        <View
                            style={styles.descriptionContainer}
                        >
                            <HtmlView
                                html={data?.description}
                            />
                        </View>
                        {
                            data?.test_enabled 
                            ?
                            <OutlineButton
                                text={strings['Пройти тест']}
                                onPress={() => props.navigation.navigate(ROUTE_NAMES.testPreview, { id: data?.id, title: data?.title })}
                                style={styles.testButton}
                            />
                            :
                            null
                        }
                        {
                            data?.task_enabled
                            ?
                            <OutlineButton
                                text={strings['Пройти задание']}
                                onPress={() => props.navigation.navigate(ROUTE_NAMES.courseTask, {id: data?.id, title: data?.title })}
                                style={styles.taskButton}
                            />
                            :
                            null
                        }
                    </View>
                }
            </UniversalView>
            {
                isLoading || isCaptured
                ?
                null
                :
                <RowView style={styles.switchBar}>
                    {
                        data?.isFirst
                        ?
                        <View/>
                        :
                        <TouchableOpacity style={styles.switchButton} onPress={previousLessonTapped}>
                            <LeftIcon color={APP_COLORS.placeholder}/>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity style={styles.switchButton} onPress={nextLessonTapped} disabled={isModal}>
                        <RightIcon color={APP_COLORS.placeholder}/>
                    </TouchableOpacity>
                </RowView>
            }   
            <Overlay visible={isModal}/>
        </UniversalView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        // marginBottom: 100
    },
    isCapturedContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    indicator: {
        marginTop: 130
    },
    video: {
        width: WIDTH - 32,
        alignItems: "center",
    },
    title: {
        ...setFontStyle(21, '700'),
        marginVertical: 16
    },
    descriptionContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    testButton: {
        marginTop: 16,
        marginBottom: 8
    },
    taskButton: {
        marginBottom: 150
    },
    switchBar: {
        position: "absolute",
        bottom: 0,
        width: WIDTH,
        padding: 16,
        paddingTop: 7,
        paddingBottom: 50,
        justifyContent: "space-between",
        backgroundColor: "white",
        borderTopWidth: 0.75,
        borderColor: APP_COLORS.border
    },
    switchButton: {
        width: 42,
        height: 42,
        borderRadius: 100,
        backgroundColor: APP_COLORS.input,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default LessonScreen