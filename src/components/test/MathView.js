import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';
import { ColorApp } from '../../constans/constants';

const MathView = ({
    text,
    mathStyle,
    mathFontSize = 15
}) => {

    return (
        <View
            style={mathStyle}
        >
            <MathJaxSvg
                style={mathStyle}
                fontSize={mathFontSize}
                color={ColorApp.font}
                fontCache
            >
                {text}
            </MathJaxSvg>
        </View>
    )
};


export default MathView;
