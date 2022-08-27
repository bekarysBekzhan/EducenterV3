import React, {useEffect, useState, useCallback, Fragment} from 'react';
import {Alert, Modal, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Clipboard from '@react-native-clipboard/clipboard';
import {launchImageLibrary} from 'react-native-image-picker';
import {setFontStyle, wordLocalization} from '../../utils/utils';
import UniversalView from '../../components/view/UniversalView';
import RowView from '../../components/view/RowView';
import SimpleButton from '../../components/button/SimpleButton';
import Loader from '../../components/Loader';
import {useFetching} from '../../hooks/useFetching';
import {OperationService} from '../../services/API';
import {strings} from '../../localization';
import UploadCheck from '../../components/UploadCheck';
import {API_V2} from '../../services/axios';
import {shadowStyle} from '../../utils/shadowStyle';
import {checkPrice} from '../../utils/checkPrice';
import CardDetail from '../../components/view/CardDetail';
import {ClipCheckIcon} from '../../assets/icons';

const KaspiBankScreen = ({route}) => {
  const {kaspiBank, type, mode} = route?.params;
  console.log('kaspiBank param: ', kaspiBank, type);

  const [dataSource, setDataSource] = useState({
    data: null,
    visible: false,
    text: '',
    list: [],
  });

  const [source, setSource] = useState(null);

  const [uploader, setUploader] = useState({
    data: null,
    sender: false,
    loading: false,
    hideButton: false,
    removeLoading: false,
  });

  const [fetchOperation, isLoading, error] = useFetching(async () => {
    let params = {
      json: true,
    };

    if (mode?.period_id && mode?.period_id?.hasOwnProperty('period')) {
      params.period_id = mode?.period_id?.id;
    } else if (mode?.packet_id) {
      params.packet_id = mode?.packet_id?.id;
    }

    if (mode?.promocode) {
      params.promocode = mode?.promocode;
    }

    params.useBonuses = mode?.useBonuses;
    const response = await OperationService.fetchKaspiBank(
      kaspiBank?.id,
      type,
      params,
    );
    setDataSource(prev => ({
      ...prev,
      data: response?.data,
    }));
  });

  // Детали kaspi
  useEffect(() => {
    fetchOperation();
  }, []);

  //Copy pasta
  const copyValue = useCallback(index => {
    switch (index) {
      case 1:
        Clipboard.setString(dataSource?.data?.card_number);
        close(strings['Номер карты']);
        break;
      case 2:
        Clipboard.setString(dataSource?.data?.phone);
        close(strings['Номер телефона']);
        break;
      case 3:
        Clipboard.setString(dataSource?.data?.iin);
        close(strings.ИИН);
        break;
      case 4:
        Clipboard.setString(dataSource?.data?.fio);
        close(strings.ФИО);
        break;
    }
  }, []);

  //Modal toogle copy pasta
  const close = text => {
    setDataSource(prev => ({...prev, visible: true, text}));
    setTimeout(() => setDataSource(prev => ({...prev, visible: false})), 1000);
  };

  // Получить картинки из галереи
  const uploadImage = useCallback(() => {
    let options = {
      mediaType: 'photo',
      quality: 0.5,
    };

    launchImageLibrary(options, res => {
      console.log('image', res);

      if (!res?.didCancel) {
        console.log('Process');
        const source = {
          name: res?.assets[0]?.fileName,
          type: res?.assets[0]?.type,
          uri: res?.assets[0]?.uri,
        };
        setSource(source);
        setUploader(prev => ({...prev, hideButton: false}));
      }
    });
  }, []);

  //Удалям чек если был отправлен
  const remove = useCallback(async () => {
    if (uploader?.sender) {
      setUploader(prev => ({...prev, removeLoading: true, hideButton: true}));
      try {
        let params = {type: type};

        const res = await API_V2.get(
          `${SUBSCRIBES_REMOVE_CHECK_URL}/${kaspiBank?.id}`,
          {params},
        );
        console.log('res remove: ', res);

        setSource(null);

        setUploader(prev => ({
          ...prev,
          sender: false,
          hideButton: true,
        }));

        if (res?.data?.data?.id) {
          setUploader(prev => ({
            ...prev,
            removeLoading: false,
            hideButton: true,
          }));
          Alert.alert(strings['Внимание!'], strings['Ваш чек удален']);
        } else {
          setUploader(prev => ({
            ...prev,
            removeLoading: false,
            hideButton: true,
          }));
          Alert.alert(strings['Внимание!'], strings['Ошибка!']);
        }
      } catch (e) {
        console.log('catch remove: ', e, e?.response);
        setUploader(prev => ({
          ...prev,
          removeLoading: false,
          hideButton: true,
        }));
      }
    } else {
      setSource(null);
    }
  }, [uploader?.sender]);

  //Загружаем чек
  const sendFile = async () => {
    try {
      setUploader(prev => ({...prev, loading: true}));

      const formData = new FormData();
      formData.append('check_file', source);
      formData.append('type', type);

      const res = await API_V2.post(
        `${SUBSCRIBES_UPLOAD_CHECK_URL}/${kaspiBank?.id}`,
        formData,
        {
          headers: {
            [CONTENT_TYPE]: MULTIPART_FORM_DATA,
          },
        },
      );
      console.log('res sendFile:', res);

      if (res?.data?.data?.id) {
        Alert.alert(strings['Внимание!'], strings['Ваш чек отправлен']);

        setUploader(prev => ({
          ...prev,
          sender: true,
          hideButton: true,
          loading: false,
        }));
      } else {
        Alert.alert(strings['Внимание!'], strings['Ошибка!']);

        setUploader(prev => ({
          ...prev,
          sender: false,
          hideButton: false,
          loading: false,
        }));
      }
    } catch (e) {
      console.log('catch sendFile: ', e, e?.response);
      setUploader(prev => ({...prev, loading: false}));
    }
  };

  return (
    <UniversalView
      haveScroll
      haveLoader={isLoading}
      contentContainerStyle={styles.list}>
      <Fragment>
        <Text style={styles.info}>
          {wordLocalization(
            strings[
              'Переведите :sum по реквизитам указанный ниже и прикрепите чек.'
            ],
            {sum: checkPrice(dataSource?.data?.price)},
          )}
        </Text>
        <FastImage
          source={require('../../assets/images/KaspiCard.png')}
          style={styles.kaspi}>
          <Text style={styles.cardNumber}>{dataSource?.data?.card_number}</Text>
          <Text style={styles.cardName}>{dataSource?.data?.card_name}</Text>
        </FastImage>

        <CardDetail
          title={strings['Номер карты']}
          value={dataSource?.data?.card_number}
          onPress={() => copyValue(1)}
        />

        <CardDetail
          title={strings['Номер телефона']}
          value={dataSource?.data?.phone}
          onPress={() => copyValue(2)}
        />

        <CardDetail
          title={strings.ИИН}
          value={dataSource?.data?.iin}
          onPress={() => copyValue(3)}
        />

        <CardDetail
          title={strings.ФИО}
          value={dataSource?.data?.fio}
          onPress={() => copyValue(4)}
        />

        {uploader?.removeLoading ? (
          <Loader />
        ) : (
          <UploadCheck
            text={strings['Прикрепите чек']}
            placeholder={strings['Загрузите чек']}
            onPress={uploadImage}
            file={source}
            remove={remove}
          />
        )}

        {source && !uploader?.hideButton ? (
          <SimpleButton
            text={strings['Подтвердить оплату']}
            style={styles.button}
            onPress={sendFile}
            loading={uploader?.loading}
          />
        ) : null}
      </Fragment>
      <Modal visible={dataSource?.visible} transparent animationType="fade">
        <View style={styles.modal}>
          <RowView style={styles.clip}>
            <ClipCheckIcon />
            <Text style={styles.text}>
              {dataSource?.text} {strings.скопировано}
            </Text>
          </RowView>
        </View>
      </Modal>
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  info: {
    ...setFontStyle(17),
  },
  kaspi: {
    width: '100%',
    height: 224,
    marginTop: 16,
    marginBottom: 8,
    justifyContent: 'flex-end',
    paddingVertical: 32,
  },
  cardNumber: {
    ...setFontStyle(28, '400', '#fff'),
    marginLeft: 32,
    marginRight: 8,
  },
  cardName: {
    ...setFontStyle(18, '400', '#fff'),
    textTransform: 'uppercase',
    marginLeft: 32,
    marginRight: 8,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  clip: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...shadowStyle(),
  },
  text: {
    ...setFontStyle(17, '600'),
    marginLeft: 10,
  },
  button: {
    marginTop: 24,
  },
});

export default KaspiBankScreen;
