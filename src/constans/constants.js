import {Dimensions, StyleSheet} from 'react-native';

export const WIDTH = Dimensions.get('screen').width;
export const HEIGHT = Dimensions.get('screen').height;

export const APP_COLORS = {
  primary: '#5559F4',
  placeholder: '#808191',
  font: '#111621',
  input: '#F5F5F5',
  border: 'rgba(0, 0, 0, 0.1)',
  gray: '#F5F5F5',
  gray2: '#FCFCFD',
  toast: 'rgba(17, 22, 33, 0.88)',
};

export const DOMAIN = 'https://demo.educenter.kz';
export const REQUEST_HEADERS = {
  Accept: 'application/json',
  Authorization: 'Authorization',
  lang: 'lang',
};

export const URLS = {
  settings: 'settings/mobile',
  languages: 'languages',
  courses: 'courses',
  courseByID: 'course/',
  categories: 'categories',
  lesson: 'lesson/',
  lessonTestStart: 'test/start/lesson/',
  lessonTestInfo: "test/info/lesson/",
  lessonTestSelect: "test/select/",
  lessonTestFinish: "test/finish/",
  login: 'auth/login',
  recovery: 'auth/recovery',
  register: 'auth/register',
  news:'news',
  profile:'user/profile'
};

export const STORAGE = {
  token: 'token',
  language: 'language',
  user: 'user',
};
