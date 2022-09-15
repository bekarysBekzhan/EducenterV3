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
  items = [],
  index,
  passing_answers,
  onTrackChange = () => undefined,
  is_multiple = false,
  extraStyle,
  extraTextStyle,
  resultType,
}) => {

  const memoStylesContainer = useMemo(() => [styles.container, extraStyle], []);
  const memoStylesText = useMemo(
    () => [setFontStyle(18, '500', APP_COLORS.primary), {}, extraTextStyle],
    [],
  );

  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    // console.log("passing answers : " , passing_answers)
    // console.log("question : " , questionItem)
  }, [])

  const onSelect = (newIndex) => {
    if (selectedIndex !== newIndex) {
      setSelectedIndex(newIndex);
    } else {
      setSelectedIndex(null)
    }
  };

  const getSelected = (item, i) => {

    if (selectedIndex !== null) {
      return selectedIndex === i
    }

    if (item?.selected !== undefined && item?.selected !== null) {
      return item?.selected
    }
      
    if (selectedIndex === null) {
      return passing_answers?.[questionItem?.id]?.[item?.id]?.selected
    } 

  }

  const views = {
    audio: <AudioPlayer url={getAudioUrl(questionItem?.question)} _index={index} onTrackChange={onTrackChange}/>,
    html: <HtmlView html={questionItem?.question} baseStyle={styles.baseStyle} tagsStyles={tagsStyles}/>,
    formula: <MathView text={questionItem?.question} mathStyle={{padding: 14}}/>
  }

  return (
    <View style={memoStylesContainer}>
      <Text style={memoStylesText}>{index + 1} - вопрос</Text>
      {selectComponent(questionItem?.question, views.audio, views.formula, views.html)}
      {items.map((item, i) => {
        return (
          <AnswerOption
            item={item}
            resultType={resultType}
            passingID={passing_answers?.[questionItem?.id]?.[item?.id]?.id}
            index={i}
            selected={getSelected(item, i)}
            onSelect={onSelect}
            is_multiple={is_multiple}
            onTrackChange={onTrackChange}
            correct={item?.is_correct}
            key={i}
          />
        )
      })}
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
