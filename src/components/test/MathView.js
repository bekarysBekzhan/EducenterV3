import React from 'react';
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';
import { THEME } from '../../constants/theme';
import { checkRenderType } from '../../util/checkRenderType';
import HtmlView from './HtmlView';

const MathView = ({
    text,
    mathStyle,
    baseStyle,
    tagsStyles,
    mathFontSize = 15
}) => {

    const render = checkRenderType(text) ?
        <MathJaxSvg
            style={mathStyle}
            fontSize={mathFontSize}
            color={THEME.fontColor}
            fontCache
        >
            {text}
        </MathJaxSvg>
        :
        <HtmlView
            html={text}
            baseStyle={baseStyle}
            tagsStyles={tagsStyles}
        />

    return render;
};

export default MathView;
