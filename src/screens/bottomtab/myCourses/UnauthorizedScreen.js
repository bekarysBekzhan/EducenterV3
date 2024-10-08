import {View, Text, StyleSheet} from 'react-native';
import React, { useLayoutEffect } from 'react';
import UniversalView from '../../../components/view/UniversalView';
import FastImage from 'react-native-fast-image';
import {WIDTH} from '../../../constants/constants';
import OutlineButton from '../../../components/button/OutlineButton';
import {setFontStyle} from '../../../utils/utils';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import {useLocalization} from '../../../components/context/LocalizationProvider';
import { lang } from '../../../localization/lang';

const UnauthorizedScreen = props => {
  const {localization} = useLocalization();

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitleAlign: 'center',
      headerLeft: null,
      headerRight: null,
    });
  });

  const loginTapped = () => {
    props.navigation.navigate(ROUTE_NAMES.login);
  };

  const signupTapped = () => {
    props.navigation.navigate(ROUTE_NAMES.register);
  };

  return (
    <UniversalView
      haveScroll
      style={styles.container}
      contentContainerStyle={{alignItems: 'center'}}>
      <FastImage
        source={require('../../../assets/images/MyCoursesPlaceHolder.png')}
        style={styles.placeholder}
      />
      <Text style={styles.title}>{lang('Ваши курсы', localization)}</Text>
      <Text style={styles.tips}>
        {
          lang('Здесь будут ваши курсы, тесты и задания. Войдите или создайте аккаунт чтобы увидеть', localization)
        }
      </Text>
      <OutlineButton
        text={lang('Войти', localization)}
        style={styles.signin}
        onPress={loginTapped}
      />
      <OutlineButton
        text={lang('Создать аккаунт', localization)}
        style={styles.signup}
        onPress={signupTapped}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  placeholder: {
    width: WIDTH,
    height: 250,
    marginVertical: 32,
  },
  title: {
    ...setFontStyle(23, '700'),
    marginBottom: 24,
  },
  tips: {
    ...setFontStyle(14, '400'),
    textAlign: 'center',
    marginBottom: 24,
  },
  signin: {
    width: '100%',
    marginBottom: 10,
  },
  signup: {
    width: '100%',
    borderWidth: 0,
  },
});

export default UnauthorizedScreen;
