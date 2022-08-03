import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import AudioPlayer from '../AudioPlayer';
import MathView from './MathView';
import {selectComponent, setFontStyle} from '../../utils/utils';
import {APP_COLORS} from '../../constans/constants';
import HtmlView from '../HtmlView';
import { getAudioUrl } from '../../utils/utils';
import AnswerOption from './AnswerOption';
import {useRef} from 'react';

const DATA = [
  {
    id: 1,
    answer: 'Пользователю легко с интерфейсом',
  },
  {
    id: 2,
    answer:
      '<div class="ckeditor-html5-audio" style="text-align:center">\r\n<audio controls="controls" controlslist="nodownload" src="https://demo.educenter.kz/storage/files/243573902162d8ffa8da5fa8.96197209_Audio - Steve Jobs - Stay Hung.mp3">&nbsp;</audio>\r\n</div>\r\n\r\n<p>&nbsp;</p>',
  },
  {
    id: 3,
    answer:
      '<p><span class="math-tex">\\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)</span></p>',
  },
];

const Question = ({
  questionItem,
  index,
  passing_answers,
  onTrackChange,
  is_multiple = false,
  extraStyle,
  extraTextStyle,
}) => {
  const memoStylesContainer = useMemo(() => [styles.container, extraStyle], []);
  const memoStylesText = useMemo(
    () => [setFontStyle(18, '400', APP_COLORS.primary), {}, extraTextStyle],
    [],
  );

  const currentSetState = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null)

  // useEffect(() => {console.log("question item : " , questionItem)}, []);

  const onSelect = (newIndex, setState) => {
    if (selectedIndex !== newIndex) {

      setSelectedIndex(newIndex)

      if (currentSetState.current) {
        currentSetState.current("unselected")
      }

      setState("selected")

      currentSetState.current = setState
    } else {
      setState(prev => prev === "selected" ? "unselected" : "selected")
    }
  }

  return (
    <View style={memoStylesContainer}>
      <Text style={memoStylesText}>{index + 1} - вопрос</Text>
      {selectComponent(
        questionItem?.question,
        <AudioPlayer
          url={getAudioUrl(questionItem?.question)}
          _index={index}
          onTrackChange={onTrackChange}
        />,
        <MathView text={questionItem?.question} mathStyle={{padding: 14}} />,
        <HtmlView
          html={questionItem?.question}
          baseStyle={styles.baseStyle}
          tagsStyles={tagsStyles}
        />,
      )}
      {
        questionItem.answers.map((option, i) => (
          <AnswerOption
            item={option}
            index={i}
            selected={option?.selected !== undefined ? option?.selected : selectedIndex === null ? passing_answers?.[questionItem?.id]?.[option?.id]?.selected : selectedIndex === i}
            onSelect={onSelect}
            is_multiple={is_multiple}
            onTrackChange={onTrackChange}
            key={i}
          />
        ))
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  baseStyle: {},
});

const tagsStyles = {
  div: {},
  p: {},
  span: {},
  image: {},
  iframe: {},
};

export default Question;
