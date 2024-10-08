import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import SimpleButton from '../../components/button/SimpleButton';
import { useSettings } from '../../components/context/Provider';
import Input from '../../components/Input';
import { ROUTE_NAMES } from '../../components/navigation/routes';
import UniversalView from '../../components/view/UniversalView';
import { APP_COLORS, N_STATUS, REQUEST_HEADERS, STORAGE } from '../../constants/constants';
import { useFetching } from '../../hooks/useFetching';
import { ProfileService } from '../../services/API';
import { API_V2 } from '../../services/axios';
import { removeStorage } from '../../storage/AsyncStorage';
import { useLocalization } from '../../components/context/LocalizationProvider';
import { lang } from '../../localization/lang';

const DeleteAccountScreen = ({ navigation }) => {
  const [word, setWord] = useState(null);
  const { setIsAuth, settings, nstatus } = useSettings();
  const { localization } = useLocalization();

  const [fetchDeleteAccount, isLoading, error] = useFetching(async () => {
    const result = await ProfileService.fetchDeleteAccount({ password: word });

    if (result?.data?.hasOwnProperty('errors')) {
      const value = Object.values(result.data?.errors);
      Alert.alert(lang('Внимание!', localization), value[0]);
    } else {
      onExit();
    }
  });

  const onExit = async () => {
    await removeStorage(STORAGE.userToken);
    delete API_V2.defaults.headers[REQUEST_HEADERS.Authorization];
    setIsAuth(false);
    if (nstatus === N_STATUS) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ROUTE_NAMES.bottomTab }],
        }),
      );
    } else {
      if (settings?.marketplace_enabled) {
        navigation.replace(ROUTE_NAMES.login);
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: ROUTE_NAMES.bottomTab }],
          }),
        );
      }
    }
  };

  return (
    <UniversalView>
      <Input
        onChangeText={word => setWord(word)}
        value={word}
        secureTextEntry
        placeholder={lang('Пароль', localization)}
        placeholderTextColor={APP_COLORS.placeholder}
        extraStyle={styles.input}
      />
      <SimpleButton
        style={styles.navButton}
        text={lang('Удалить аккаунт', localization)}
        loading={isLoading}
        onPress={fetchDeleteAccount}></SimpleButton>
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  navButton: {
    paddingVertical: 16,
    marginHorizontal: 16,
  },
  input: {
    marginHorizontal: 16,
    marginVertical: 13,
    backgroundColor: APP_COLORS.input,
  },
  inputTextStyle: {

  }
});

export default DeleteAccountScreen;
