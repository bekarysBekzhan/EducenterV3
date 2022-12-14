import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {HideIcon, ShowIcon} from '../assets/icons';
import SimpleButton from '../components/button/SimpleButton';
import Input from '../components/Input';
import AuthDetailView from '../components/view/AuthDetailView';
import UniversalView from '../components/view/UniversalView';
import {useFetching} from '../hooks/useFetching';
import { useToggle } from '../hooks/useToggle';
import {strings} from '../localization';
import {ProfileService} from '../services/API';

const ChangePassword = () => {
  const [dataSource, setDataSource] = useState({
    loading: false,
    old_password: '',
    password: '',
    confirm_password: '',
  });

  const [toggleOldPassword, setToggleOldPassword] = useToggle(true);
  const [toggleNewPassword, setToggleNewPassword] = useToggle(true);
  const [toggleCfmPassword, setToggleCfmPassword] = useToggle(true);

  const [fetchChangePassword, isLoading, error] = useFetching(async () => {
    if (
      dataSource?.old_password.length <= 0 &&
      dataSource.password.length <= 0 &&
      dataSource?.confirm_password.length <= 0
    ) {
      Alert.alert(strings['Внимание!'], strings['Заполните все поля']);
      return;
    } else if (dataSource?.password != dataSource?.confirm_password) {
      Alert.alert(strings['Внимание!'], strings['Пароли не совпадают']);
      return;
    }

    let params = {
      old_password: dataSource?.old_password,
      password: dataSource?.confirm_password,
    };
    await ProfileService.fetchChangePassword(params);
    setDataSource(prev => ({
      ...prev,
      old_password: '',
      password: '',
      confirm_password: '',
    }));
    Alert.alert(strings['Внимание!'], strings['Пароль изменен']);
  });

  return (
    <UniversalView haveScroll contentContainerStyle={styles.view}>
      <AuthDetailView haveLogo />
      <Input
        extraStyle={styles.inputView}
        placeholder={strings['Старый пароль']}
        right={toggleOldPassword ? <ShowIcon /> : <HideIcon />}
        extraInputStyle={styles.inputStyle}
        secureTextEntry={toggleOldPassword}
        onPressRightIcon={setToggleOldPassword}
        onChangeText={old_password =>
          setDataSource(prev => ({...prev, old_password}))
        }
        value={dataSource?.old_password}
      />
      <Input
        extraStyle={styles.inputView}
        placeholder={strings['Новый пароль']}
        right={toggleNewPassword ? <ShowIcon /> : <HideIcon />}
        extraInputStyle={styles.inputStyle}
        secureTextEntry={toggleNewPassword}
        onPressRightIcon={setToggleNewPassword}
        onChangeText={password => setDataSource(prev => ({...prev, password}))}
        value={dataSource?.password}
      />
      <Input
        extraStyle={styles.inputView}
        placeholder={strings['Повторите пароль']}
        right={toggleCfmPassword ? <ShowIcon /> : <HideIcon />}
        extraInputStyle={styles.inputStyle}
        secureTextEntry={toggleCfmPassword}
        onPressRightIcon={setToggleCfmPassword}
        onChangeText={confirm_password =>
          setDataSource(prev => ({...prev, confirm_password}))
        }
        value={dataSource?.confirm_password}
      />

      <SimpleButton
        style={styles.button}
        text={strings['Сохранить новый пароль']}
        onPress={fetchChangePassword}
        loading={isLoading}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  view: {
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
  inputStyle: {
    marginRight: 12,
  },
  inputView: {
    marginBottom: 8,
  },
});

export default ChangePassword;
