import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setFontStyle } from '../../utils/utils';

const TextButton = ({
    onPress,
    style,
    text,
    textStyle
}) => (
    <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{ ...styles.button, ...style }}
    >
        <Text style={{ ...styles.text, ...textStyle }}>{text}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        marginTop: 22,
        paddingVertical: 8
    },
    text: {
        ...setFontStyle(17),
        textAlign: 'center'
    }
})

export default TextButton;