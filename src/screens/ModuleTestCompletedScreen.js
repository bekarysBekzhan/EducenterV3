import {Text, StyleSheet} from 'react-native';
import React, {useLayoutEffect} from 'react';
import UniversalView from '../components/view/UniversalView';
import {setFontStyle, wordLocalization} from '../utils/utils';
import FastImage from 'react-native-fast-image';
import {APP_COLORS, HEIGHT, RESULT_TYPES, WIDTH} from '../constans/constants';
import SimpleButton from '../components/button/SimpleButton';
import {ROUTE_NAMES} from '../components/navigation/routes';
import {useLocalization} from '../components/context/LocalizationProvider';
import {lang} from '../localization/lang';

const ModuleTestCompletedScreen = props => {
  const {localization} = useLocalization();

  const id = props.route?.params?.id;
  const entity = props.route?.params?.entity;
  const passed = props.route?.params?.passed;
  const correct = props.route?.params?.correct;
  const total = props.route?.params?.total;
  const resultType = props.route?.params?.resultType;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: lang('Завершение теста', localization),
    });
  }, []);

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
      return lang('У вас больше 50% правильных ответов', localization);
    }
    return lang(
      'У вас меньше 50% правильных ответов. Вам нужно заново пройти тест.',
      localization,
    );
  };

  const onResults = () => {
    props.navigation.navigate(ROUTE_NAMES.testResult, {id, resultType});
  };

  const onAgain = () => {
    props.navigation.navigate(ROUTE_NAMES.testPreview, {
      id: entity?.id,
      again: true,
      type: 'module',
      title: entity?.title,
    });
  };

  const onGoHome = () => {
    props.navigation.popToTop();
  };

  return (
    <UniversalView style={styles.container}>
      <Banner>
        <Text style={styles.score}>
          {wordLocalization(lang(':num из :count', localization), {
            num: correct,
            count: total,
          })}
        </Text>
        <Text style={styles.aboutResult}>{posterText()}</Text>
      </Banner>
      {resultType === RESULT_TYPES.NONE ||
      resultType === undefined ||
      resultType === null ? null : (
        <SimpleButton
          text={lang('Результаты', localization)}
          textStyle={styles.resultsText}
          style={[
            styles.resultsButton,
            {backgroundColor: passed ? APP_COLORS.primary : 'red'},
          ]}
          onPress={onResults}
        />
      )}
      <SimpleButton
        text={lang('Пройти заново', localization)}
        textStyle={[
          styles.againText,
          {color: passed ? APP_COLORS.primary : 'red'},
        ]}
        style={styles.againButton}
        onPress={onAgain}
      />
      <SimpleButton
        text={lang('На главную', localization)}
        textStyle={[
          styles.againText,
          {color: passed ? APP_COLORS.primary : 'red'},
        ]}
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
    margin: 16,
  },
  resultsText: {},
  againButton: {
    margin: 16,
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  againText: {},
});

export default ModuleTestCompletedScreen;
