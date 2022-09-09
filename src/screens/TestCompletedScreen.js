import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import UniversalView from '../components/view/UniversalView';
import {setFontStyle, wordLocalization} from '../utils/utils';
import {strings} from '../localization';
import FastImage from 'react-native-fast-image';
import {APP_COLORS, HEIGHT, RESULT_TYPES, WIDTH} from '../constans/constants';
import SimpleButton from '../components/button/SimpleButton';
import RowView from '../components/view/RowView';
import { ROUTE_NAMES } from '../components/navigation/routes';

const TestCompletedScreen = props => {

  const id = props.route?.params?.id
  const passed = props.route?.params?.passed;
  const correct = props.route?.params?.correct;
  const total = props.route?.params?.total;
  const resultType = props.route?.params?.resultType

  const Banner = ({children}) => {
    const passedTestBanner = require('../assets/images/PassedTestBanner.png');
    const failedTestBanner = require('../assets/images/FailedTestBanner.png');

    if (passed) {
      return (
        <FastImage style={styles.poster} source={passedTestBanner}>
          {children}
        </FastImage>
      );
    }
    return (
      <FastImage style={styles.poster} source={failedTestBanner}>
        {children}
      </FastImage>
    );
  };

  const posterText = () => {
    if (passed) {
      return strings['У вас больше 50% правильных ответов'];
    }
    return strings[
      'У вас меньше 50% правильных ответов. Вам нужно заново пройти тест.'
    ];
  };

  const onResults = () => {
    props.navigation.navigate(ROUTE_NAMES.testResult, { id, resultType})
  }

  const onAgain = () => {

  }

  const onGoHome = () => {

  }

  return (
    <UniversalView style={styles.container}>
      <Banner>
        <Text style={styles.score}>
          {wordLocalization(strings[':num из :count'], {
            num: correct,
            count: total,
          })}
        </Text>
        <Text style={styles.aboutResult}>{posterText()}</Text>
      </Banner>
      {
        resultType === RESULT_TYPES.NONE || resultType === undefined || resultType === null
        ?
        null
        :
        <SimpleButton
          text={strings.Результаты}
          textStyle={styles.resultsText}
          style={[styles.resultsButton, { backgroundColor: passed ? APP_COLORS.primary : "red" }]}
          onPress={onResults}
        />
      }
      <SimpleButton
        text={strings['Пройти заново']}
        textStyle={[styles.againText, { color: passed ? APP_COLORS.primary : "red" }]}
        style={styles.againButton}
        onPress={onAgain}
      />
      <SimpleButton
        text={strings['На главную']}
        textStyle={[styles.againText, { color: passed ? APP_COLORS.primary : "red" }]}
        style={styles.againButton}
        onPress={onGoHome}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red"
  },
  poster: {
    width: WIDTH,
    height: HEIGHT / 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  score: {
    ...setFontStyle(29, '700'),
    marginBottom: 6,
  },
  aboutResult: {
    ...setFontStyle(15, '400'),
    textAlign: 'center',
  },
  resultsButton: {
    margin: 16
  },
  resultsText: {},
  againButton: {
    margin: 16,
    marginTop: 0,
    backgroundColor: "transparent"
  },
  againText: {},
});

export default TestCompletedScreen;
