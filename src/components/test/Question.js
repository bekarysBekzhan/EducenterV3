import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import AudioPlayer from '../AudioPlayer';
import MathView from './MathView';
import {selectComponent, setFontStyle} from '../../utils/utils';
import {APP_COLORS} from '../../constans/constants';
import HtmlView from '../HtmlView';
import {getAudioUrl} from '../../utils/utils';
import AnswerOption from './AnswerOption';
import {useRef} from 'react';

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
    () => [setFontStyle(18, '500', APP_COLORS.primary), {}, extraTextStyle],
    [],
  );

  const currentSetState = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const onSelect = (newIndex, setState) => {
    if (selectedIndex !== newIndex) {
      setSelectedIndex(newIndex);

      if (currentSetState.current) {
        currentSetState.current('unselected');
      }

      setState('selected');

      currentSetState.current = setState;
    } else {
      setState(prev => (prev === 'selected' ? 'unselected' : 'selected'));
    }
  };

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
      {questionItem.answers.map((option, i) => (
        <AnswerOption
          item={option}
          passingID={passing_answers?.[option?.test_id]?.[option?.id]?.id}
          index={i}
          selected={
            option?.selected !== undefined
              ? option?.selected
              : selectedIndex === null
              ? passing_answers?.[questionItem?.id]?.[option?.id]?.selected
              : selectedIndex === i
          }
          onSelect={onSelect}
          is_multiple={is_multiple}
          onTrackChange={onTrackChange}
          key={i}
        />
      ))}
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
