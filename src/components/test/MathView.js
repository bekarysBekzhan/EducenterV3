import React from 'react';
import { View } from 'react-native';
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';
import { APP_COLORS } from '../../constants/constants';

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
                color={APP_COLORS.font}
                fontCache
            >
                {text}
            </MathJaxSvg>
        </View>
    )
};


export default MathView;
