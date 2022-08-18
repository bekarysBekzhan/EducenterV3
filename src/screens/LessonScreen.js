import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import React from 'react'
import UniversalView from '../components/view/UniversalView'
import { useEffect } from 'react'
import { useFetching } from '../hooks/useFetching'
import { CourseService } from '../services/API'
import { useState } from 'react'
import { APP_COLORS, WIDTH } from '../constans/constants'
import HtmlView from '../components/HtmlView'
import { fileDownloader, setFontStyle } from '../utils/utils'
import RowView from '../components/view/RowView'
import { pdf } from '../assets/icons'
import { useRef } from 'react'
import { useCallback } from 'react'
import { Fragment } from 'react'

const LessonScreen = (props) => {

    const id = props.route?.params?.id
    const [data, setData] = useState(null)
    const [fetchLesson, isLoading, lessonError] = useFetching(async() => {
        const response = await CourseService.fetchLesson(id)
        setData(response.data?.data)
    })

    useEffect(() => {
        fetchLesson()
    }, [])

    return (
        <UniversalView>
            {
                isLoading
                ?
                <ActivityIndicator style={styles.indicator} color={APP_COLORS.primary}/>
                :
                <View>
                    <View style={styles.video}>
                        <HtmlView
                            html={data?.video}
                        />
                    </View>
                    <Text style={styles.title}>{data?.title}</Text>
                    {
                        data?.files.map((file, index) => (
                            // <FileItem urlFile={file}/>
                            null
                        ))
                    }
                </View>
            }
        </UniversalView>
    )
}

const FileItem = ({
    style,
    urlFile,
    fileName
}) => {

    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    const refJobId = useRef(null);

    const fileExtension = () => {

        if (fileName) {
            let exe = fileName?.split('.');

            return exe[exe.length - 1];
        }
        return '';

    };

    const onProgress = useCallback(data => {

        console.log('progress: ', data);

        if (data) {
            refJobId.current = data?.jobId;
            let currentPercent = (data?.bytesWritten * 100) / data?.contentLength;
            setProgress(currentPercent);
        } else {
            refJobId.current = null;
            setProgress(0);
        }

    }, []);

    const downloader = useCallback(() => {

        setVisible(true);
        fileDownloader(urlFile, fileName, () => setVisible(false), onProgress);

    }, []);

    const cancelDownloader = useCallback(() => {

        setVisible(false);
        if (refJobId.current) {
            RNFS.stopDownload(refJobId.current);
            setProgress(0);
        }

    }, []);

    return (
        <Fragment>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={downloader}
            >
                <RowView
                    style={{ ...styles.row, ...style }}
                >

                    <View style={styles.fileView} >
                        <Text numberOfLines={1} style={styles.exe}>{fileExtension()}</Text>
                    </View>

                    <Text style={styles.fileName}>{fileName}</Text>

                </RowView>
            </TouchableOpacity>
            <Downloader
                visible={visible}
                progress={progress}
                onPressCancel={cancelDownloader}
            />
        </Fragment>
    )
};

const styles = StyleSheet.create({
    container: {

    },
    indicator: {
        marginTop: 130
    },
    video: {
        width: WIDTH,
        alignItems: "center",
        marginTop: 16,
    },
    title: {
        ...setFontStyle(21, '700'),
        margin: 16
    },
    file: {
        width: WIDTH - 32,
        marginHorizontal: 16,
        justifyContent: "space-between"
    },
    row: {
        paddingBottom: 12,
        backgroundColor: "transparent",
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: APP_COLORS.gray
    },
    fileView: {
        width: 32,
        height: 32,
        borderRadius: 4,
        backgroundColor: APP_COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    exe: {
        ...setFontStyle(10, '300', "white")
    },
    fileName: {
        marginHorizontal: 8,
        ...setFontStyle()
    }
})

export default LessonScreen