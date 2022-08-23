import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { APP_COLORS } from '../constans/constants';
import * as Progress from 'react-native-progress';
import { CancelIcon } from '../assets/icons';

const Downloader = ({
    visible = false,
    progress,
    onPressCancel
}) => (
    <Modal
        visible={visible}
        animationType='fade'
        transparent
    >
        <View style={styles.view}>
            <View style={styles.container}>
                <Progress.Circle
                    progress={progress / 100}
                    size={50}
                    borderColor={APP_COLORS.primary}
                    color={APP_COLORS.primary}
                    style={styles.downloader}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.cancelButton}
                        onPress={onPressCancel}
                    >
                        {/* <CancelIcon/> */}
                    </TouchableOpacity>
                </Progress.Circle>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white'
    },
    downloader: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelButton: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Downloader;