import {Alert, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import Input from '../../components/Input';
import {strings} from '../../localization';
import SimpleButton from '../../components/button/SimpleButton';
import AuthDetailView from '../../components/view/AuthDetailView';
import {useFetching} from '../../hooks/useFetching';
import {AuthService} from '../../services/API';
import {getString, storeString} from '../../storage/AsyncStorage';
import {
  APP_COLORS,
  N_STATUS,
  REQUEST_HEADERS,
  STORAGE,
} from '../../constans/constants';
import {API_V2} from '../../services/axios';
import {useSettings} from '../../components/context/Provider';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import CountryPicker from 'react-native-country-picker-modal';
import RowView from '../../components/view/RowView';
import {firebaseService} from '../../services/FirebaseService';
import {check, HideIcon, ShowIcon} from '../../assets/icons';
import {useToggle} from '../../hooks/useToggle';

const RegisterScreen = ({navigation}) => {
  const [dataSource, setDataSource] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [togglePassword, setTogglePassword] = useToggle(true);
  const [toggleCheckMark, setToggleCheckMark] = useToggle(true);

  const [country, setCountry] = useState({
    countryCode: 'KZ',
    callingCode: '+7',
  });

  const {setIsAuth, settings, nstatus} = useSettings();

  const setName = name => setDataSource(prev => ({...prev, name}));
  const setEmail = email => setDataSource(prev => ({...prev, email}));
  const setPhone = phone => setDataSource(prev => ({...prev, phone}));
  const setPassword = password => setDataSource(prev => ({...prev, password}));

  const [fetchRegister, isLoading, error] = useFetching(async params => {
    const response = await AuthService.fetchRegister(params);
    if (response?.data?.errors) {
      Alert.alert(strings['Внимание!'], response?.data?.errors?.user_exist);
      return;
    }
    const token = response.data?.data?.api_token;
    await storeString(STORAGE.userToken, token);
    API_V2.defaults.headers[REQUEST_HEADERS.Authorization] = 'Bearer ' + token;
    setIsAuth(true);

    navigation.reset({index: 0, routes: [{name: ROUTE_NAMES.bottomTab}]});

    if (nstatus !== N_STATUS) {
      const fcmToken = await getString(STORAGE.firebaseToken);
      firebaseService.setFCMToken(fcmToken, token);
      firebaseService.registerAppWithFCM();
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings['Создать аккаунт'],
      headerTitleAlign: 'center',
    });
  });

  const onCountrySelect = country => {
    setCountry({
      countryCode: country.cca2,
      callingCode: country?.callingCode?.[0],
    });
  };

  const onSignUp = () => {
    let phone = country.callingCode;

    if (dataSource.phone.length > 0) {
      phone += dataSource.phone;
    } else {
      phone = '';
    }

    let params = {
      name: dataSource.name,
      phone: phone,
      email: dataSource.email,
      password: dataSource.password,
    };

    console.log('params', params);

    fetchRegister(params);
  };

  const licenseAgreement = () => {
    navigation.navigate(ROUTE_NAMES.privacyPolicy, {id: 3});
  };

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
        <View pointerEvents={isLoading ? 'none' : 'auto'}>
          <CountryPicker
            {...{
              withFilter: true,
              withFlag: true,
              withAlphaFilter: true,
              withCallingCode: true,
              withCallingCodeButton: true,
              withEmoji: true,
              withCloseButton: true,
              countryCode: country.countryCode,
              onSelect: onCountrySelect,
            }}
          />
        </View>
        <View style={{width: 16}} />
        <Input
          placeholder={strings['Номер телефона']}
          extraStyle={styles.input}
          keyboardType={'phone-pad'}
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
        keyboardType={'email-address'}
        extraStyle={styles.input}
        autoCapitalize={'none'}
        editable={!isLoading}
      />
      <Input
        placeholder={strings['Придумайте пароль']}
        onChangeText={setPassword}
        value={dataSource?.password}
        extraStyle={styles.input}
        secureTextEntry={togglePassword}
        right={togglePassword ? <HideIcon /> : <ShowIcon />}
        onPressRightIcon={setTogglePassword}
        editable={!isLoading}
      />
      <View style={styles.rowView}>
        <TouchableOpacity style={styles.square} onPress={setToggleCheckMark}>
          {toggleCheckMark ? check(1.5, APP_COLORS.primary) : null}
        </TouchableOpacity>
        <Text>{strings['Я принимаю']}</Text>
        <Text
          style={styles.licenseAgreementTextStyle}
          onPress={licenseAgreement}>
          {strings['условия соглашения']}
        </Text>
      </View>
      <SimpleButton
        text={strings.Зарегистрироваться}
        style={styles.button}
        loading={isLoading}
        onPress={toggleCheckMark ? onSignUp : null}
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
    alignItems: 'center',
  },
  square: {
    width: 24,
    height: 24,
    borderColor: APP_COLORS.primary,
    borderWidth: 1.5,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rowView: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  licenseAgreementTextStyle: {
    textDecorationLine: 'underline',
    color: APP_COLORS.primary,
  },
});
