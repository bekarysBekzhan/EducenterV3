import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import SimpleButton from '../../components/button/SimpleButton';
import {useSettings} from '../../components/context/Provider';
import Input from '../../components/Input';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import UniversalView from '../../components/view/UniversalView';
import {REQUEST_HEADERS, STORAGE} from '../../constans/constants';
import {useFetching} from '../../hooks/useFetching';
import {strings} from '../../localization';
import {ProfileService} from '../../services/API';
import {API_V2} from '../../services/axios';
import {removeStorage} from '../../storage/AsyncStorage';

const DeleteAccountScreen = ({navigation}) => {
  const [word, setWord] = useState(null);
  const {setIsAuth, settings, nstatus} = useSettings();

  const [fetchDeleteAccount, isLoading, error] = useFetching(async () => {
    const result = await ProfileService.fetchDeleteAccount({password: word});

    if (result?.data?.hasOwnProperty('errors')) {
      const value = Object.values(result.data?.errors);
      Alert.alert(strings['Внимание!'], value[0]);
    } else {
      onExit();
    }
  });

  const onExit = async () => {
    await removeStorage(STORAGE.userToken);
    delete API_V2.defaults.headers[REQUEST_HEADERS.Authorization];
    setIsAuth(false);
    if (settings?.marketplace_enabled) {
      navigation.replace(ROUTE_NAMES.login);
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: ROUTE_NAMES.bottomTab}],
        }),
      );
    }
  };

  return (
    <UniversalView>
      <Input
        onChangeText={word => setWord(word)}
        value={word}
        secureTextEntry
        placeholder={strings['Пароль']}
        extraStyle={{marginHorizontal: 16, marginVertical: 13}}></Input>
      <SimpleButton
        style={styles.navButton}
        text={strings['Удалить аккаунт']}
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
});

export default DeleteAccountScreen;
