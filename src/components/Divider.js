import React from 'react';
import { StyleSheet, View } from 'react-native';
import { APP_COLORS } from '../constans/constants';

const Divider = ({
    style,
    isAbsolute = true
}) => (
    <View style={isAbsolute ? { ...styles.dividerAbsoulute, ...style } : { ...styles.divider, ...style }} />
);

const styles = StyleSheet.create({
    divider: {
        backgroundColor: APP_COLORS.border,
        height: 0.5
    },
    dividerAbsoulute: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 0.5,
        backgroundColor: APP_COLORS.border
    }
});

export default Divider;