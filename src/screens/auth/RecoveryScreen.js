import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import UniversalView from '../../components/view/UniversalView';
import AuthDetailView from '../../components/view/AuthDetailView';
import Input from '../../components/Input';
import SimpleButton from '../../components/button/SimpleButton';
import TextButton from '../../components/button/TextButton';
import { useFetching } from '../../hooks/useFetching';
import { AuthService } from '../../services/API';
import { useLocalization } from './../../components/context/LocalizationProvider';
import { lang } from './../../localization/lang';
import { APP_COLORS } from '../../constants/constants';
import { LeftArrowIcon } from '../../assets/icons';

const RecoveryScreen = ({ navigation }) => {
  const { localization } = useLocalization();

  const [dataSource, setDataSource] = useState({
    email: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: lang('Восстановить пароль', localization),
      headerTitleAlign: 'center',
      headerLeft: renderHeaderLeft,
    });
  });

  const renderHeaderLeft = () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.iconButton}
      activeOpacity={0.65}
    >
      <LeftArrowIcon />
    </TouchableOpacity>
  );

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
        placeholderTextColor={APP_COLORS.placeholder}
        autoCapitalize="none"
        onChangeText={setEmail}
        editable={!isLoading}
        value={dataSource?.email}
        extraStyle={styles.input}
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
  input: {
    backgroundColor: APP_COLORS.input,
  },
  iconButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
    backgroundColor: '#FFFFFF33',
    borderRadius: 31,
    width: 36,
    height: 36,
    paddingTop: 9,
    gap: 16,
    alignItems: 'center',
  },
});
