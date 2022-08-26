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
import {APP_COLORS, STORAGE} from '../../constans/constants';
import {storeString} from '../../storage/AsyncStorage';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import RNRestart from 'react-native-restart';

const LoginScreen = ({navigation}) => {
  const [dataSource, setDataSource] = useState({
    email: '',
    password: '',
  });

  const [fetchLogin, isLoading, authError] = useFetching(async params => {
    const response = await AuthService.fetchLogin(params);
    await storeString(STORAGE.token, response?.data?.data?.token);
    RNRestart.Restart();
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

  return (
    <UniversalView haveScroll contentContainerStyle={styles.view}>
      <AuthDetailView
        title={
          strings['Войдите или создайте аккаунт чтобы смотреть онлайн курсы']
        }
        titleStyle={styles.title}
      />

      <Input
        extraStyle={styles.input}
        placeholder={strings['E-mail или телефон']}
        onChangeText={onChangeEmailOrPhone}
        value={dataSource?.email}
        autoCapitalize="none"
        editable={!isLoading}
      />
      <Input
        extraStyle={styles.input}
        placeholder={strings.Пароль}
        onChangeText={onChangePassword}
        value={dataSource?.password}
        secureTextEntry
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
