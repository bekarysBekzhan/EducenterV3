import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useState, useCallback, useRef } from 'react';
import { Fragment } from 'react';
import RowView from './view/RowView';
import Downloader from './Downloader';
import { APP_COLORS } from '../constans/constants';
import { fileDownloader, setFontStyle } from '../utils/utils';

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
        <View style={styles.container}>
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
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    file: {
        justifyContent: "space-between"
    },
    row: {
        flex: 1,
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
        flex: 1,
        marginLeft: 8,
        ...setFontStyle()
    },
})

export default FileItem