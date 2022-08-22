import {URLS} from '../constans/constants';
import {API_V2} from './axios';

const requesToFailed = url => 'Request to ' + url + ' failed!';

class MobileSettingsService {
  static fetchSettings = async () => {
    try {
      const response = await API_V2.get(URLS.settings);
      console.log('settings : ', response);
      return response;
    } catch (e) {
      console.log(e);
      console.log(requesToFailed(URLS.settings));
    }
  };

  static fetchLanguages = async () => {
    try {
      const response = await API_V2.get(URLS.languages);
      return response;
    } catch (e) {
      console.log(e);
      console.log(requesToFailed(URLS.languages));
    }
  };
}

class CourseService {
  static fetchCourses = async (
    query = '',
    page = 1,
    price = undefined,
    categoryID = undefined,
  ) => {
    try {
      let params = {
        filter: true,
        page: page,
      };
      if (query.length > 0) {
        params.query = query;
      }
      if (price) {
        params.price = price;
      }
      if (categoryID) {
        params.category_id = categoryID;
      }
      const response = await API_V2.get(URLS.courses, {params: params});
      console.log('Courses : ', response);
      return response;
    } catch (e) {
      console.log(e);
      console.log(requesToFailed(URLS.courses));
    }
  };

  static fetchCourseByID = async id => {
    try {
      const response = await API_V2.get(URLS.courseByID + id);
      console.log('Course with id ' + id + ':', response);
      return response;
    } catch (e) {
      console.log(e);
      console.log(requesToFailed(URLS.courseByID + id));
    }
  };

  static fetchCategories = async () => {
    try {
      const response = await API_V2.get(URLS.categories);
      console.log('CATEGORIES: ', response);
      return response;
    } catch (e) {
      console.log(e);
      console.log(requesToFailed(URLS.categories));
    }
  };

  static fetchLesson = async id => {
    const response = await API_V2.get(URLS.lesson + id);
    console.log('Lesson with id ' + id + ':', response);
    return response;
  };
}

class AuthService {
  static fetchLogin = async params => {
    console.log('AuthService LoginScreen params: ', params);
    const response = await API_V2.post(URLS.login, params);
    console.log('LoginScreen.js: ', response);
    return response;
  };

  static fetchRecovery = async params => {
    console.log('AuthService Recovery  params: ', params);
    const response = await API_V2.post(URLS.recovery, params);
    console.log('RecoveryScreen.js: ', response);
    return response;
  };

  static fetchRegister = async params => {
    console.log('AuthService Register  params: ', params);
    const response = await API_V2.post(URLS.register, params);
    console.log('RegisterScreen.js: ', response);
    return response;
  };
}

class NewsService {
  static fetchNews = async params => {
    console.log('NewsService News params: ', params);
    const response = await API_V2.get(URLS.news, params);
    console.log('NewsScreen.js: ', response);
    return response;
  };
}

export {MobileSettingsService, CourseService, AuthService, NewsService};
