import React from 'react';
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';
import { ColorApp } from '../../constans/ColorApp';

const MathView = ({
    text,
    mathStyle,
    mathFontSize = 15
}) => {

    return (
        <MathJaxSvg
            style={mathStyle}
            fontSize={mathFontSize}
            color={ColorApp.font}
            fontCache
        >
            {text}
        </MathJaxSvg>
    )
};

export default MathView;
