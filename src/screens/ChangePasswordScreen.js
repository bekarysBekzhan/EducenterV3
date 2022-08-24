import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import SimpleButton from '../components/button/SimpleButton';
import Input from '../components/Input';
import AuthDetailView from '../components/view/AuthDetailView';
import UniversalView from '../components/view/UniversalView';
import {useFetching} from '../hooks/useFetching';
import {ProfileService} from '../services/API';
const ChangePassword = ({}) => {
  const [dataSource, setDataSource] = useState({
    loading: false,
    old_password: '',
    password: '',
    confirm_password: '',
    hide_old_pwd: true,
    hide_new_pwd: true,
    hide_cfm_pwd: true,
  });

  const [fetchChangePassword, isLoading, error] = useFetching(async () => {
    if (
      dataSource?.old_password.length <= 0 &&
      dataSource.password.length <= 0 &&
      dataSource?.confirm_password.length <= 0
    ) {
      Alert.alert(strings['Внимание !!!'], strings['Заполните все поля']);
      return;
    } else if (dataSource?.password != dataSource?.confirm_password) {
      Alert.alert(strings['Внимание !!!'], strings['Пароли не совпадают']);
      return;
    }

    let params = {
      old_password: dataSource?.old_password,
      password: dataSource?.confirm_password,
    };
    await ProfileService.fetchChangePassword(params);
    Alert.alert(strings['Внимание !!!'], strings['Пароль изменен']);
  });

  return (
    <UniversalView isScroll>
      <AuthDetailView haveLogo />
      <Input
        placeholder={strings['Старый пароль']}
        iconRight={dataSource?.hide_old_pwd ? <SvgView /> : <SvgViewHide />}
        inputStyle={styles.inputStyle}
        secureTextEntry={dataSource?.hide_old_pwd}
        onPressRightIcon={() =>
          setDataSource(prev => ({...prev, hide_old_pwd: !prev.hide_old_pwd}))
        }
        onChangeText={old_password =>
          setDataSource(prev => ({...prev, old_password}))
        }
      />
      <Input
        placeholder={strings['Новый пароль']}
        iconRight={dataSource?.hide_new_pwd ? <SvgView /> : <SvgViewHide />}
        inputStyle={styles.inputStyle}
        secureTextEntry={dataSource?.hide_new_pwd}
        onPressRightIcon={() =>
          setDataSource(prev => ({...prev, hide_new_pwd: !prev.hide_new_pwd}))
        }
        onChangeText={password => setDataSource(prev => ({...prev, password}))}
      />
      <Input
        placeholder={strings['Повторите пароль']}
        iconRight={dataSource?.hide_cfm_pwd ? <SvgView /> : <SvgViewHide />}
        inputStyle={styles.inputStyle}
        secureTextEntry={dataSource?.hide_cfm_pwd}
        onPressRightIcon={() =>
          setDataSource(prev => ({...prev, hide_cfm_pwd: !prev.hide_cfm_pwd}))
        }
        onChangeText={confirm_password =>
          setDataSource(prev => ({...prev, confirm_password}))
        }
      />

      <SimpleButton
        style={styles.button}
        text={strings['Сохранить новый пароль']}
        onPress={setUpdatePassword}
        loading={dataSource?.loading}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
  },
  inputStyle: {
    marginRight: 12,
  },
});

export default ChangePassword;
