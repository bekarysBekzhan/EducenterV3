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
  myCourses: 'my_courses',
  courseByID: 'course/',
  courseRate: "/rate",
  finishCourse: "/finish",
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
  moduleTestStart: 'test/start/module_test/',
  moduleTestInfo: 'test/info/module_test/',
  moduleTestFinish: 'test/finish/',
  moduleTest: "/module_test",
  moduleMyTests: 'modules/tests/my/tests',
  moduleMyTasks: 'modules/tasks/my/tasks',
  moduleTasks: 'modules/tasks',
  profileUpdate: 'user/update',
  scheduleLesson: 'modules/schedule_conference',
  scheduleVisits: 'modules/schedule_conference/attendances',
  languages: 'languages',
  payments: 'payments',
  selected_type: 'selected_type',
  subscribes: 'subscribes',
  subscribe: 'subscribe',
  promocodes: 'promocodes',
  journal: 'modules/journal',
  journal_subscribed: 'modules/journal/my/subscribed',
  testResult: "test/result/",
  reviews: "reviews/",
  ubtCategories: "modules/ubt/categories",
  ubtTests: "modules/ubt/get_tests"
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
  TASK_SUBSCRIBE: 'task',
  JOURNAL_SUBCRIBE:'journal'
};

export const RESULT_TYPES = {
  WITH_WRONGS: "with_wrongs",
  DEFAULT: "default",
  NONE: "none"
}

export const ANSWER_STATES = {
  SELECTED: "selected",
  UNSELECTED: "unselected",
  CORRECT: "correct",
  INCORRECT: "incorrect"
}
export const SECONDS_IN_MINUTE = 60
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
