import axios from 'axios';
import {DOMAIN, REQUEST_HEADERS, STORAGE} from '../constans/constants';
import RNRestart from 'react-native-restart';
import Toast from 'react-native-toast-message';
import {removeStorage} from '../storage/AsyncStorage';

export const API_V2 = axios.create({
  baseURL: DOMAIN + '/api/v2/',
  headers: {
    Accept: REQUEST_HEADERS.Accept,
  },
});

API_V2.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log('API_V2.interceptors error: ', error?.response);
    handlerErrorRequest(error);
    return Promise.reject(error);
  },
);

const handlerErrorRequest = (data, onHide) => {
  console.log('handlerErrorRequest', data?.data?.errors);

  let text2 = '';

  if (data?.message != 'Network Error' && data?.response?.data?.code == 303) {
    Object.values(data?.response?.data?.errors)?.forEach(
      (element, index, _array) => {
        index != _array.length - 1
          ? (text2 += element + '\n\n')
          : (text2 += element);
      },
    );

    console.log('text2', text2);
  } else {
    if (data?.message) {
      text2 = data?.message;
    } else {
      text2 = data;
    }
  }

  const restartApp = async () => {
    delete API_V2.defaults.headers[REQUEST_HEADERS.Authorization];
    await removeStorage(STORAGE.userToken);
    RNRestart.Restart();
  };

  Toast.show({
    type: 'error',
    text2,
    autoHide: true,
    visibilityTime: 1500,
    position: 'bottom',
    bottomOffset: 100,
    onHide:
      data?.response?.status == 401 || data?.response?.status == 419
        ? restartApp
        : onHide,
  });
};
