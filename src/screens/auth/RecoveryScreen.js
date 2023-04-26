import {Alert, StyleSheet} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import AuthDetailView from '../../components/view/AuthDetailView';
import Input from '../../components/Input';
import SimpleButton from '../../components/button/SimpleButton';
import TextButton from '../../components/button/TextButton';
import {useFetching} from '../../hooks/useFetching';
import {AuthService} from '../../services/API';
import {useLocalization} from './../../components/context/LocalizationProvider';
import {lang} from './../../localization/lang';

const RecoveryScreen = ({navigation}) => {
  const {localization} = useLocalization();

  const [dataSource, setDataSource] = useState({
    email: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: lang('Восстановить пароль', localization),
      headerTitleAlign: 'center',
    });
  });

  const [fetchingRecovery, isLoading] = useFetching(async () => {
    let params = {
      email: dataSource?.email,
    };
    const response = await AuthService.fetchRecovery(params);
    setDataSource(prev => ({
      ...prev,
      email: '',
    }));
    Alert.alert(lang('Внимание!', localization), response?.data?.message);
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
        title={lang('Восстановить пароль', localization)}
        description={lang(
          'Введите ваш E-mail чтобы восстановить ваш пароль',
          localization,
        )}
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
        text={lang('Восстановить', localization)}
        loading={isLoading}
        onPress={() => fetchingRecovery()}
      />
      <TextButton
        text={lang('Я вспомнил пароль', localization)}
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
