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
  tabBg: '#F5F5F5',
  white: '#fff',
  transparent: 'transparent',
  label: '#808191',
};

export const DOMAIN = 'https://demo.educenter.kz';
export const REQUEST_HEADERS = {
  Accept: 'application/json',
  Authorization: 'Authorization',
  lang: 'lang',
  contentType: 'Content-Type',
  multipartFormData: 'multipart/form-data',
};

export const URLS = {
  settings: 'settings/mobile',
  languages: 'languages',
  courses: 'courses',
  myCourses: "my_courses",
  courseByID: 'course/',
  categories: 'categories',
  lesson: 'lesson/',
  lessonTestStart: 'test/start/lesson/',
  lessonTestInfo: 'test/info/lesson/',
  lessonTestSelect: 'test/select/',
  lessonTestFinish: 'test/finish/',
  lessonTaskShow: 'task/show/lesson/',
  lessonTaskSend: 'task/send/',
  login: 'auth/login',
  recovery: 'auth/recovery',
  register: 'auth/register',
  news: 'news',
  profile: 'user/profile',
  history: 'user/history',
  changePassword: 'user/update_password',
  moduleTests: 'modules/tests',
  moduleMyTests: "modules/tests/my/tests",
  moduleTasks: 'modules/tasks',
  profileUpdate: 'user/update',
  scheduleLesson: 'modules/schedule_conference',
  scheduleVisits: 'modules/schedule_conference/attendances',
  languages: 'languages',
  payments: 'payments',
  selected_type: 'selected_type',
  subscribes: 'subscribes',
  subscribe: 'subscribe',
  promocodes:'promocodes'
};

export const STORAGE = {
  token: 'token',
  language: 'language',
  user: 'user',
  courseSearchHistory: 'courseSearchHistory',
  testSearchHistory: 'testSearchHistory',
  taskSearchHistory: 'taskSearchHistory',
};

export const TYPE_SUBCRIBES = {
  COURSE_SUBCRIBE: 'course',
  TEST_SUBCRIBE: 'test',
};
