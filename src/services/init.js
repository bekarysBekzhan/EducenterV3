import {REQUEST_HEADERS, STORAGE} from '../constans/constants';
import {strings} from '../localization';
import {getString} from '../storage/AsyncStorage';
import {API_V2} from './axios';

export const init = async () => {
  let token = await getString(STORAGE.token);
  let language = await getString(STORAGE.language);
  console.log('TOKEN init(): ', token);
  console.log('LANGUAGE init(): ', language);

  if (token) {
    API_V2.defaults.headers[REQUEST_HEADERS.Authorization] = `Bearer ${token}`;
  }

  if (language) {
    API_V2.defaults.headers[REQUEST_HEADERS.lang] = language;
    strings.setLanguage(language);
  } else {
    API_V2.defaults.headers[REQUEST_HEADERS.lang] = 'ru';
    strings.setLanguage('ru');
  }
};
