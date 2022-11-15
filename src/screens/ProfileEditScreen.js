import React, {useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import SimpleButton from '../components/button/SimpleButton';
import InputLabel from '../components/InputLabel';
import {useFetching} from '../hooks/useFetching';
import {strings} from '../localization';
import RowView from '../components/view/RowView';
import UniversalView from '../components/view/UniversalView';
import FastImage from 'react-native-fast-image';
import Input from '../components/Input';
import {ProfileService} from '../services/API';
import {ROUTE_NAMES} from '../components/navigation/routes';

const ProfieEditScreen = ({route, navigation}) => {
  const {profileEdit} = route.params;
  console.log('profileEdit', profileEdit);

  const [dataSource, setDataSource] = useState({
    ...profileEdit,
    loading: false,
    selectedImage: false,
    fileName: null,
    type: null,
  });

  const [fetchUpdateProfile, isLoading, error] = useFetching(async () => {
    const formData = new FormData();

    formData.append('name', dataSource?.name);
    formData.append('phone', dataSource?.phone);
    formData.append('email', dataSource?.email);

    if (dataSource?.selectedImage) {
      formData.append('avatar', {
        uri: dataSource?.avatar,
        type: dataSource?.type,
        name: dataSource?.fileName,
      });
    }

    await ProfileService.fetchProfileUpdate(formData);
    Alert.alert(strings['Внимание!'], strings['Данные изменины'], [
      {
        text: 'OK',
        onPress: () =>
          navigation.navigate({
            name: ROUTE_NAMES.profile,
            params: {profile: true},
            merge: true,
          }),
      },
    ]);
  });

  const changeAvatar = () => {
    let options = {
      mediaType: 'photo',
      quality: 0.5,
    };

    launchImageLibrary(options, res => {
      console.log('changeAvatar', res);

      if (!res?.didCancel) {
        console.log('Process');
        setDataSource(prev => ({
          ...prev,
          avatar: res?.assets[0]?.uri,
          type: res?.assets[0]?.type,
          fileName: res?.assets[0]?.fileName,
          selectedImage: true,
        }));
      }
    });
  };

  return (
    <UniversalView haveScroll contentContainerStyle={styles.view}>
      <RowView>
        <TouchableOpacity activeOpacity={0.9} onPress={changeAvatar}>
          <FastImage
            source={{
              uri: dataSource?.avatar,
              priority: 'high',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Input
          placeholder={strings.ФИО}
          extraStyle={styles.input}
          onChangeText={name => setDataSource(prev => ({...prev, name}))}
          value={dataSource?.name}
          editable={!isLoading}
        />
      </RowView>

      <InputLabel
        label={strings['Номер телефона']}
        isMask
        onChangeText={phone => setDataSource(prev => ({...prev, phone}))}
        value={dataSource?.phone}
        editable={!isLoading}
      />

      <InputLabel
        autoCapitalize="none"
        label={strings.Email}
        onChangeText={email => setDataSource(prev => ({...prev, email}))}
        value={dataSource?.email}
        editable={!isLoading}
      />

      <SimpleButton
        text={strings['Сохранить изменения']}
        style={styles.button}
        onPress={fetchUpdateProfile}
        loading={isLoading}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  view: {
    padding: 16,
  },
  input: {
    flex: 1,
    marginLeft: 16,
  },
  button: {
    marginTop: 40,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 56,
  },
});

export default ProfieEditScreen;
