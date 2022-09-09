import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useMemo, useState} from 'react';
import {ANSWER_STATES, APP_COLORS, RESULT_TYPES} from '../../constans/constants';
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
    case ANSWER_STATES.SELECTED:
      return selectedStyles[component];
    case ANSWER_STATES.UNSELECTED:
      return unselectedStyles[component];
    case ANSWER_STATES.CORRECT:
      return correctStyles[component];
    case ANSWER_STATES.INCORRECT:
      return incorrectStyles[component];
    default:
      console.log('There is no state called ' + state);
  }
};

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

  console.log("AnswerOption rendered!");

  const initialState = () => {

    if (resultType === RESULT_TYPES.DEFAULT) {

      if (correct) {
        return ANSWER_STATES.CORRECT
      }

      if (selected) {
        return ANSWER_STATES.INCORRECT
      }

      return ANSWER_STATES.UNSELECTED
    } 
    else if (resultType === RESULT_TYPES.WITH_WRONGS) {

      if (selected) {
        if (correct) {
          return ANSWER_STATES.CORRECT
        }
        return ANSWER_STATES.INCORRECT
      }

      return ANSWER_STATES.UNSELECTED

    }

    if (selected) {
      return ANSWER_STATES.SELECTED
    }

    return ANSWER_STATES.UNSELECTED

  }

  const [state, setState] = useState(initialState());

  const [sendAnswer, isLoading, sendingError] = useFetching(async() => {
    let params = { selected: !(state === ANSWER_STATES.SELECTED), is_multiple: is_multiple}
    console.log("passing id : " , passingID)
    const response = await CourseService.selectAnswer(passingID, { params: params})
  })

  useEffect(() => {
    if (sendingError) {
      console.log(sendingError)
      setState(ANSWER_STATES.UNSELECTED)
    }
  }, [sendingError])

  useEffect(() => {
    setState(initialState())
  }, [selected])

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
      { borderRadius: is_multiple ? 4 : 50 },
    ],
    [state],
  );

  useEffect(() => {

    item.selected = state === ANSWER_STATES.SELECTED

  }, [state])

  const selectTapped = () => {
    if (is_multiple) {
      setState(prev => prev === ANSWER_STATES.SELECTED ? ANSWER_STATES.UNSELECTED : ANSWER_STATES.SELECTED)
    } else {
      onSelect(index);
    }
    sendAnswer()
  }

  const renderIcon = () => {
    if (state === ANSWER_STATES.INCORRECT) {
      return x()
    } 
    return check()
  }

  const views = {
    audio: <AnswerAudio url={getAudioUrl(item.answer)} _index={100} onTrackChange={onTrackChange} style={styles.audioContainer} sliderStyle={styles.slider} maximumTrackTintColor={state === ANSWER_STATES.SELECTED ? '#FFFFFF' : undefined} />,
    formula: <MathView text={item.answer} />,
    html: <HtmlView html={item.answer} />
  }

  const isSelectDisabled = () => {
    if (resultType || isLoading) {
      return true
    }
    return false
  }

  return (
    <TouchableOpacity
      style={memoStylesContainer}
      onPress={selectTapped}
      activeOpacity={0.7}
      disabled={isSelectDisabled()}
    >
      <View style={memoStylesCheckbox}>
        {renderIcon()}
      </View>
      {selectComponent(item.answer, views.audio, views.formula, views.html)}
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
    padding: 6
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
    padding: 6
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
    padding: 7
  },
});

export default AnswerOption;
