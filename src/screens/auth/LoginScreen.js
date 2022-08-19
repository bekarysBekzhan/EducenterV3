import {StyleSheet} from 'react-native';
import React from 'react';
import UniversalView from '../../components/view/UniversalView';
import Input from '../../components/Input';
import {useState} from 'react';
import {strings} from '../../localization';
import SimpleButton from '../../components/button/SimpleButton';
import TextButton from '../../components/button/TextButton';
import AuthDetailView from '../../components/view/AuthDetailView';
import {useFetching} from '../../hooks/useFetching';
import {AuthService} from '../../services/API';
import {APP_COLORS} from '../../constans/constants';
import RNRestart from 'react-native-restart';

const LoginScreen = () => {
  const [dataSource, setDataSource] = useState({
    email: '',
    password: '',
  });

  const [fetchLogin, isLoading, authError] = useFetching(async () => {
    const response = await AuthService.fetchLogin(dataSource);
    console.log('+++++++++', response);
    console.log('AUTHER', authError);
    // if (authError) {
    //   RNRestart.Restart();
    // }
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
        onPress={fetchLogin}
      />
      <TextButton text={strings['Я забыл пароль']} disabled={isLoading} />
      <TextButton
        style={styles.registerButton}
        text={strings['У меня нет аккаунта']}
        textStyle={styles.registerText}
      />
    </UniversalView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 16,
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
