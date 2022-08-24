import {URLS} from '../constans/constants';
import {API_V2} from './axios';

class MobileSettingsService {
  static fetchSettings = async () => {
    const response = await API_V2.get(URLS.settings);
    console.log('settings : ', response);
    return response;
  };

  static fetchLanguages = async () => {
    const response = await API_V2.get(URLS.languages);
    return response;
  };
}

class CourseService {
  static fetchCourses = async (
    query = '',
    page = 1,
    price = undefined,
    categoryID = undefined,
  ) => {
    let params = {
      filters: true,
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
  };

  static fetchCourseByID = async id => {
    const response = await API_V2.get(URLS.courseByID + id);
    console.log('Course with id ' + id + ':', response);
    return response;
  };

  static fetchCategories = async () => {
    const response = await API_V2.get(URLS.categories);
    console.log('CATEGORIES: ', response);
    return response;
  };

  static fetchLesson = async id => {
    const response = await API_V2.get(URLS.lesson + id);
    console.log('Lesson with id ' + id + ':', response);
    return response;
  };

  static fetchTest = async id => {
    const response = await API_V2.get(URLS.lessonTestStart + id);
    console.log('Lesson test with id ' + id + ':', response);
    return response;
  };

  static fetchTestInfo = async id => {
    const response = await API_V2.get(URLS.lessonTestInfo + id);
    console.log('Lesson test info with id : ' + id + ':', response);
    return response;
  };

  static selectAnswer = async (id, params) => {
    const response = await API_V2.get(URLS.lessonTestSelect + id, params);
    return response;
  };

  static finishTest = async id => {
    const response = await API_V2.get(URLS.lessonTestFinish + id + '/lesson');
    console.log('Lesson test with id ' + id + ' ended:', response);
    return response;
  };

  static fetchTask = async id => {
    const response = await API_V2.get(URLS.lessonTaskShow + id);
    console.log('Lesson task with id ' + id + ':', response);
    return response;
  };

  static sendTaskAnswer = async (id, answer, file, controller, setProgress) => {
    let params = {id, answer, file, controller, setProgress};

    console.log('task answer params : ', params);

    const formData = new FormData();

    formData.append('answer', answer);

    if (file) {
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    }

    const response = await API_V2.post(URLS.lessonTaskSend + id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: controller.signal,
      onUploadProgress: e => setProgress(e.loaded / e.total),
    });
    console.log('Task with id ' + id + ' sent:', response);
    return response;
  };
}

class TestService {

  static fetchTests = async(query = '', page = 1, price = undefined, categoryID = undefined) => {
    let params = {
      filters: true,
      page: page
    }
    if(query.length > 0) {
      params.query = query
    }
    if (price) {
      params.price = price;
    }
    if (categoryID) {
      params.category_id = categoryID;
    }
    const response = await API_V2.get(URLS.moduleTests, {params: params})
    console.log("Tests : " , response)
    return response
  }

  static fetchTestByID = async(id) => {
    const response = await API_V2.get(URLS.moduleTests + "/" + id)
    console.log("Test with id " + id + ":" , response)
    return response
  }

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

  static fetchNewsDetail = async id => {
    console.log('NewsService NewsDetail params: ', id);
    const response = await API_V2.get(`${URLS.news}/${id}`, id);
    console.log('NewsDetailScreen.js: ', response);
    return response;
  };
}

class ProfileService {
  static fetchProfile = async () => {
    const response = await API_V2.get(URLS.profile);
    console.log('ProfileScreen.js: ', response);
    return response;
  };

  static fetchProfileUpdate = async params => {
    const response = await API_V2.post(URLS.profileUpdate, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('ProfileEdit.js: ', response);
    return response;
  };

  static fetchChangePassword = async params => {
    const response = await API_V2.post(URLS.changePassword, params);
    console.log('ChangePassword.js: ', response);
    return response;
  };
}

class HistoryService {
  static fetchHistory = async params => {
    console.log('params HistoryScreen.js', params);
    const response = await API_V2.get(URLS.history, {params: params });
    console.log('HistoryScreen.js: ', response);
    return response;
  };
}

export {
  MobileSettingsService,
  CourseService,
  AuthService,
  NewsService,
  ProfileService,
  HistoryService,
  TestService
};
