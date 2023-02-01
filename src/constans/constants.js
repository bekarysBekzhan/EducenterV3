import {Dimensions} from 'react-native';

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
export const PURE_DOMAIN = DOMAIN.substring(8);
export const CONFIG_TOKEN =
  'fmv5aTwGkAwuTzKibSU4JHTmlpkDtZHxdHQowkKVbk0Xk9Xl0pzZCCVBhvFjXmUJHiaPmLTeriI52BFpD7jRH9xxDhSNqaD7WRp4HTwdRhWKQLiLge2edDV0vVDj6R44rGu2J0YW9OoHdYqxphVyyJFM7fHMjN86fCYrHSb9gqTMAqPu2Zvc7E48ZRyJORB';
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
  courseRate: '/rate',
  finishCourse: '/finish',
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
  moduleTest: '/module_test',
  moduleMyTests: 'modules/tests/my/tests',
  moduleMyTasks: 'modules/tasks/my/tasks',
  moduleTasks: 'modules/tasks',
  moduleTask: 'task/show/module_task/',
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
  testResult: 'test/result/',
  reviews: 'reviews/',
  offlineCourses: 'offline_courses',
  ubtCategories: 'modules/ubt/categories',
  ubtTests: 'modules/ubt/get_tests',
  ubtTestStart: 'test/start/module_ubt/',
  ubtTestInfo: 'test/info/module_ubt/',
  ubtTestFinish: 'modules/ubt/finish/',
  ubtModule: '/module_ubt',
  ubtTestResult: 'modules/ubt/result/',
  sendComment: '/send_comment',
  notifications: 'notifications',
  rating: 'modules/tests/my/rating',
  getStatus: 'get',
  pages: 'pages',
  userDelete: 'user/delete',
  kaspi_check: 'subscribes/upload_check',
  kaspi_remove: 'subscribes/remove_check',
};

export const STORAGE = {
  userToken: 'userToken',
  language: 'language',
  courseSearchHistory: 'courseSearchHistory',
  testSearchHistory: 'testSearchHistory',
  taskSearchHistory: 'taskSearchHistory',
  offlineSearchHistory: 'offlineSearchHistory',
  firebaseToken: 'firebaseToken',
  initialStart: 'initialStart',
  isRead: 'isRead',
  track: 'track',
  pushEnabled: 'pushEnabled',
};

export const TYPE_SUBCRIBES = {
  COURSE_SUBCRIBE: 'course',
  TEST_SUBCRIBE: 'test',
  TASK_SUBSCRIBE: 'task',
  JOURNAL_SUBCRIBE: 'journal',
};

export const RESULT_TYPES = {
  WITH_WRONGS: 'with_wrongs',
  WITH_RIGHTS: 'with_rights',
  DEFAULT: 'default',
  NONE: 'none',
};

export const ANSWER_STATES = {
  SELECTED: 'selected',
  UNSELECTED: 'unselected',
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
};
export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
export const NOTIFICATION_TYPE = {
  news: 'news',
  test: 'test',
  task: 'task',
  buy: 'buy',
  course: 'course',
  complete: 'complete',
  certificate: 'certificate',
};

export const AUTH_TYPE = {
  emailPhone: 'email-phone',
  email: 'email',
  phone: 'phone',
};

export const SHOW_TYPE = {
  test: 'test',
  result: 'result',
};

export const N_STATUS = '2';
export const N_DESIGN = '0';

