import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { setFontStyle } from '../../utils/utils';
import { APP_COLORS } from '../../constants/constants';
import { BellIcon, SettingsIcon } from '../../assets/icons';

export const navHeaderOptions = (title) => {
    return {
        headerTitle: title,
        headerTitleAlign: 'left',
        headerTitleStyle: styles.navigationTitle,
        headerLeftContainerStyle: styles.navigationHeader,
    };
};

const styles = StyleSheet.create({
    logo: {
        width: 38,
        height: 100,
        borderRadius: 6,
        marginRight: 12,
    },
    navigationHeader: {
        backgroundColor: 'black',
    },
    navigationTitle: {
        ...setFontStyle(20, '700', APP_COLORS.white),
    },
});
