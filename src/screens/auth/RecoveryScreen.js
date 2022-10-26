import {Alert, StyleSheet} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import AuthDetailView from '../../components/view/AuthDetailView';
import {strings} from '../../localization';
import Input from '../../components/Input';
import SimpleButton from '../../components/button/SimpleButton';
import TextButton from '../../components/button/TextButton';
import {useFetching} from '../../hooks/useFetching';
import {AuthService} from '../../services/API';

const RecoveryScreen = ({navigation}) => {
  const [dataSource, setDataSource] = useState({
    email: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings['Восстановить пароль'],
      headerTitleAlign: 'center',
    });
  });

  const [fetchingRecovery, isLoading, error] = useFetching(async param => {
    if (dataSource?.email?.length) {
      const response = await AuthService.fetchRecovery(param);
      setDataSource(prev => ({
        ...prev,
        email: '',
      }));
      Alert.alert(strings['Внимание!'], response?.data?.message);
    }
  });

  const onBack = () => {
    navigation.goBack();
  };

  const setEmail = email => {
    setDataSource(prev => ({
      ...prev,
      email,
    }));
  };

  return (
    <UniversalView haveScroll style={styles.view}>
      <AuthDetailView
        haveLogo
        title={strings['Восстановить пароль']}
        description={
          strings['Введите ваш E-mail чтобы восстановить ваш пароль']
        }
      />
      <Input
        placeholder={'E-mail'}
        autoCapitalize="none"
        onChangeText={setEmail}
        editable={!isLoading}
        value={dataSource?.email}
      />
      <SimpleButton
        style={styles.button}
        text={strings.Восстановить}
        loading={isLoading}
        onPress={() => fetchingRecovery(dataSource)}
      />
      <TextButton
        text={strings['Я вспомнил пароль']}
        onPress={onBack}
        disabled={isLoading}
      />
    </UniversalView>
  );
};

export default RecoveryScreen;

const styles = StyleSheet.create({
  view: {
    padding: 16,
  },
  button: {
    marginTop: 24,
  },
});
