import {StyleSheet, View} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import Input from '../../components/Input';
import {strings} from '../../localization';
import SimpleButton from '../../components/button/SimpleButton';
import AuthDetailView from '../../components/view/AuthDetailView';
import {useFetching} from '../../hooks/useFetching';
import {AuthService} from '../../services/API';
import {getString, storeString} from '../../storage/AsyncStorage';
import {REQUEST_HEADERS, STORAGE} from '../../constans/constants';
import { API_V2 } from '../../services/axios';
import { useSettings } from '../../components/context/Provider';
import { CommonActions } from '@react-navigation/native';
import { ROUTE_NAMES } from '../../components/navigation/routes';
import CountryPicker from "react-native-country-picker-modal"
import RowView from '../../components/view/RowView';
import { firebaseService } from '../../services/FirebaseService';

const RegisterScreen = ({navigation}) => {

  const [dataSource, setDataSource] = useState({
    name: '',
    email: '',
    countryCode: "KZ",
    callingCode: "+7",
    phone: '',
    password: '',
  });

  const { setIsAuth, settings } = useSettings()

  const setName = name => setDataSource(prev => ({...prev, name}));
  const setEmail = email => setDataSource(prev => ({...prev, email}));
  const setPhone = phone => setDataSource(prev => ({...prev, phone}));
  const setPassword = password => setDataSource(prev => ({...prev, password}));

  const [fetchRegister, isLoading, error] = useFetching(async params => {
    const response = await AuthService.fetchRegister(params);
    const token = response.data?.data?.api_token
    await storeString(STORAGE.userToken, token)
    API_V2.defaults.headers[REQUEST_HEADERS.Authorization] = "Bearer " + token
    setIsAuth(true)
    if (settings?.marketplace_enabled) {
      navigation.replace(ROUTE_NAMES.bottomTab)
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {name: ROUTE_NAMES.bottomTab }
          ]
      }))
    }
    const fcmToken = await getString(STORAGE.firebaseToken);
    firebaseService.setFCMToken(fcmToken, token);
    firebaseService.registerAppWithFCM();
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings['Создать аккаунт'],
      headerTitleAlign: 'center',
    });
  });

  const onCountrySelect = (country) => {
    console.log("country : " , country)
    setDataSource(prev => ({
      ...prev,
      countryCode: country.cca2,
      callingCode: country?.callingCode[0]
    }))
  }

  return (
    <UniversalView haveScroll contentContainerStyle={styles.view}>
      <AuthDetailView
        title={strings['Создать аккаунт']}
        titleStyle={styles.title}
      />
      <Input
        placeholder={strings.ФИО}
        onChangeText={setName}
        value={dataSource?.name}
        extraStyle={styles.input}
        editable={!isLoading}
      />
      <RowView style={styles.phone}>
        <CountryPicker
          {...{
            withFilter: true,
            withFlag: true,
            withAlphaFilter: true,
            withCallingCode: true,
            withCallingCodeButton: true,
            withEmoji: true,
            withCloseButton: true,
            countryCode: dataSource.countryCode,
            onSelect: onCountrySelect,
          }}
          // visible
        />
        <View style={{ width: 16 }}/>
        <Input
          placeholder={strings['Номер телефона']}
          extraStyle={styles.input}
          mask={'(999) 999 99 99'}
          editable={!isLoading}
          value={dataSource?.phone}
          onChangeText={setPhone}
        />
      </RowView>
      <Input
        placeholder={'E-mail'}
        onChangeText={setEmail}
        value={dataSource?.email}
        extraStyle={styles.input}
        autoCapitalize={'none'}
        editable={!isLoading}
      />
      <Input
        placeholder={strings['Придумайте пароль']}
        onChangeText={setPassword}
        value={dataSource?.password}
        extraStyle={styles.input}
        secureTextEntry
        editable={!isLoading}
      />
      <SimpleButton
        text={strings.Зарегистрироваться}
        style={styles.button}
        loading={isLoading}
        onPress={() => {
          setDataSource(prev => ({
            ...prev,
            phone: dataSource.callingCode + prev.phone
          }))
          fetchRegister(dataSource)
        }}
      />
    </UniversalView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  view: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  input: {
    flex: 1,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  phone: {
    flex: 1,
    alignItems: "center"
  },
});
