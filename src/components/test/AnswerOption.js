import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useMemo, useState} from 'react';
import {APP_COLORS} from '../../constans/constants';
import {check, x} from '../../assets/icons';
import {getAudioUrl, selectComponent} from '../../utils/utils';
import MathView from './MathView';
import HtmlView from '../HtmlView';
import {useEffect} from 'react';
import { useFetching } from '../../hooks/useFetching';
import { CourseService } from '../../services/API';
import AnswerAudio from '../AnswerAudio';

const dynamicContainerStyle = (state, component) => {
  switch (state) {
    case 'selected':
      return selectedStyles[component];
    case 'unselected':
      return unselectedStyles[component];
    case 'correct':
      return correctStyles[component];
    case 'incorrect':
      return incorrectStyles[component];
    default:
      console.log('There is no state called ' + state);
  }
};

// result_types = "with_wrongs" | "default" | "none"

const AnswerOption = ({
  item = {},
  passingID,
  index,
  is_multiple = false,
  onSelect = () => undefined,
  selected = false,
  onTrackChange = () => undefined,
  correct,
  extraStyle,
  extraTextStyle,
  resultType,
}) => {

  const initialState = () => {

    if (correct === undefined) {
      if (selected) {
        return "selected"
      }
      return "unselected"
    }

    if (correct) {
      return "correct"
    }

    return "incorrect"
  }

  const [state, setState] = useState(initialState());

  const [sendAnswer, isLoading, sendingError] = useFetching(async() => {
    let params = { selected: !(state === "selected"), is_multiple: is_multiple}
    const response = await CourseService.selectAnswer(passingID, { params: params})
  })

  const memoStylesContainer = useMemo(
    () => [
      styles.container,
      dynamicContainerStyle(state, 'container'),
      extraStyle,
    ],
    [state],
  );
  const memoStylesCheckbox = useMemo(
    () => [
      styles.checkbox,
      dynamicContainerStyle(state, 'checkbox'),
      {
        borderRadius: is_multiple ? 4 : 50,
        padding: correct === false ? 7 : 6,
      },
    ],
    [state],
  );

  useEffect(() => {
    if (selected && !is_multiple) {
      onSelect(index, setState)
    }
  }, []);

  useEffect(() => {
    item.selected = state === "selected" ? true : false
  },[state])

  const selectTapped = () => {
    sendAnswer()
    if (is_multiple) {
      setState(prev => prev === "selected" ? "unselected" : "selected")
    } else {
      onSelect(index, setState);
    }
  }

  return (
    <TouchableOpacity
      style={memoStylesContainer}
      onPress={selectTapped}
      activeOpacity={0.7}
      disabled={correct !== undefined || isLoading}>
      <View style={memoStylesCheckbox}>
        {correct === false ? x() : check()}
      </View>
      {selectComponent(
        item.answer,
        <AnswerAudio
          url={getAudioUrl(item.answer)}
          _index={100}
          onTrackChange={onTrackChange}
          style={styles.audioContainer}
          sliderStyle={styles.slider}
          maximumTrackTintColor={state === 'selected' ? '#FFFFFF' : undefined}
        />,
        <MathView text={item.answer} />,
        <HtmlView html={item.answer} />,
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 5 / 4,
    marginBottom: 7,
  },
  checkbox: {
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 5 / 4,
  },
  audioContainer: {
    backgroundColor: 'transparent',
    paddingRight: 40,
  },
  slider: {
    width: 20,
  },
});

const selectedStyles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F2FE',
    borderColor: '#F1F2FE',
  },
  checkbox: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
});

const unselectedStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F5F5F5',
  },
  checkbox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ACB4BE',
  },
});

const correctStyles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F6ED',
    borderColor: '#F0F6ED',
  },
  checkbox: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
});

const incorrectStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFEFEE',
    borderColor: '#FFEFEE',
  },
  checkbox: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
});

export default AnswerOption;
