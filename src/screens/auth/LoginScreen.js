import {StyleSheet} from 'react-native';
import React, {useLayoutEffect} from 'react';
import UniversalView from '../../components/view/UniversalView';
import Input from '../../components/Input';
import {useState} from 'react';
import {strings} from '../../localization';
import SimpleButton from '../../components/button/SimpleButton';
import TextButton from '../../components/button/TextButton';
import AuthDetailView from '../../components/view/AuthDetailView';
import {useFetching} from '../../hooks/useFetching';
import {AuthService} from '../../services/API';
import {
  APP_COLORS,
  AUTH_TYPE,
  N_STATUS,
  REQUEST_HEADERS,
  STORAGE,
} from '../../constans/constants';
import {getString, storeString} from '../../storage/AsyncStorage';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import {useSettings} from '../../components/context/Provider';
import {API_V2} from '../../services/axios';
import {firebaseService} from '../../services/FirebaseService';
import {HideIcon, ShowIcon} from '../../assets/icons';
import {useToggle} from '../../hooks/useToggle';

const LoginScreen = ({navigation}) => {
  const {setIsAuth, settings, nstatus} = useSettings();

  const [dataSource, setDataSource] = useState({
    email: '',
    password: '',
  });

  const [togglePassword, setTogglePassword] = useToggle(true);

  const [fetchLogin, isLoading] = useFetching(async params => {
    const response = await AuthService.fetchLogin(params);
    const token = response?.data?.data?.token;
    await storeString(STORAGE.userToken, token);
    API_V2.defaults.headers[REQUEST_HEADERS.Authorization] = 'Bearer ' + token;
    setIsAuth(true);
    navigation.reset({index: 0, routes: [{name: ROUTE_NAMES.bottomTab}]});
    if (nstatus !== N_STATUS) {
      firebaseService.registerAppWithFCM();
      const fcmToken = await getString(STORAGE.firebaseToken);
      firebaseService.setFCMToken(fcmToken, token);
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings['Войти в аккаунт'],
      headerTitleAlign: 'center',
    });
  });

  const onChangeEmailOrPhone = email => {
    setDataSource(prev => ({
      ...prev,
      email,
    }));
  };

  const onChangePassword = password => {
    setDataSource(prev => ({
      ...prev,
      password,
    }));
  };

  const onNavigationRecovery = () => {
    navigation.navigate(ROUTE_NAMES.recovery);
  };

  const onNavigationRegister = () => {
    navigation.navigate(ROUTE_NAMES.register);
  };

  const renderLogin = () => {
    if (settings?.auth_type === AUTH_TYPE.email) {
      return (
        <Input
          extraStyle={styles.input}
          placeholder={strings.Email}
          onChangeText={onChangeEmailOrPhone}
          value={dataSource?.email}
          autoCapitalize="none"
          editable={!isLoading}
        />
      );
    } else if (settings?.auth_type === AUTH_TYPE.phone) {
      return (
        <Input
          extraStyle={styles.input}
          placeholder={strings['Номер телефона']}
          onChangeText={onChangeEmailOrPhone}
          editable={!isLoading}
          keyboardType={'phone-pad'}
          mask={'+9 (999) 999-99-99'}
        />
      );
    }
    return (
      <Input
        extraStyle={styles.input}
        placeholder={strings['E-mail или телефон']}
        onChangeText={onChangeEmailOrPhone}
        value={dataSource?.email}
        autoCapitalize="none"
        editable={!isLoading}
      />
    );
  };

  return (
    <UniversalView haveScroll contentContainerStyle={styles.view}>
      <AuthDetailView
        title={
          strings['Войдите или создайте аккаунт чтобы смотреть онлайн курсы']
        }
        titleStyle={styles.title}
      />
      {renderLogin()}
      <Input
        extraStyle={styles.input}
        placeholder={strings.Пароль}
        onChangeText={onChangePassword}
        value={dataSource?.password}
        secureTextEntry={togglePassword}
        right={togglePassword ? <HideIcon /> : <ShowIcon />}
        onPressRightIcon={setTogglePassword}
        editable={!isLoading}
      />
      <SimpleButton
        style={styles.button}
        text={strings.Войти}
        loading={isLoading}
        onPress={() => fetchLogin(dataSource)}
      />
      <TextButton
        text={strings['Я забыл пароль']}
        disabled={isLoading}
        onPress={onNavigationRecovery}
      />
      <TextButton
        style={styles.registerButton}
        text={strings['У меня нет аккаунта']}
        textStyle={styles.registerText}
        onPress={onNavigationRegister}
      />
    </UniversalView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  title: {
    marginBottom: 24,
  },
  registerButton: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
  },
  registerText: {
    color: APP_COLORS.primary,
  },
});
