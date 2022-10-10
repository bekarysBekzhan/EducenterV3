import React, {useEffect, useLayoutEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useFetching} from '../../hooks/useFetching';
import {MobileSettingsService} from '../../services/API';
import {useSettings} from '../context/Provider';
import {ROUTE_NAMES} from './routes';
import {getObject, getString} from '../../storage/AsyncStorage';
import Splash from './SplashStack';
import BottomTab from './BottomTabStack';
import LessonScreen from '../../screens/LessonScreen';
import PreviewTestScreen from '../../screens/PreviewTestScreen';
import CourseTestScreen from '../../screens/CourseTestScreen';
import {API_V2} from '../../services/axios';
import CourseTaskScreen from '../../screens/CourseTaskScreen';
import {REQUEST_HEADERS, STORAGE} from '../../constans/constants';
import CourseSearchScreen from '../../screens/CourseSearchScreen';
import TestSearchScreen from '../../screens/TestSearchScreen';
import TaskSearchScreen from '../../screens/TaskSearchScreen';
import KaspiBankScreen from '../../screens/operation/KaspiBankScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen';
import RecoveryScreen from '../../screens/auth/RecoveryScreen';
import LoadingScreen from '../LoadingScreen';
import ModuleTestScreen from '../../screens/bottomtab/tests/ModuleTestScreen';
import ReadJournalScreen from '../../screens/journal/ReadJournalScreen';
import OperationScreen from '../../screens/operation/OperationScreen';
import WebViewerScreen from '../../screens/operation/WebViewerScreen';
import TestCompletedScreen from '../../screens/TestCompletedScreen';
import CourseCompletedScreen from '../../screens/CourseCompletedScreen';
import WriteReviewScreen from '../../screens/WriteReviewScreen';
import TestResultScreen from '../../screens/TestResultScreen';
import ReviewsScreen from '../../screens/ReviewsScreen';
import UBTTestScreen from '../../screens/ubt/UBTTestScreen';
import UBTCompletedScreen from '../../screens/ubt/UBTCompletedScreen';
import UBTResultScreen from '../../screens/ubt/UBTResultScreen';
import ModuleTestCompletedScreen from '../../screens/ModuleTestCompletedScreen';
import {navigationRef} from './RootNavigation';
import NewsDetailScreen from '../../screens/news/NewsDetailScreen';
import {strings} from '../../localization';
import OfflineCourseSearchScreen from '../../screens/OfflineCourseSearchScreen';
import NotificationsScreen from '../../screens/NotificationsScreen';
import ModuleTaskScreen from '../../screens/ModuleTaskScreen';
import PrivacyScreen from '../../screens/privacy/PrivacyScreen';
import PolicyScreen from '../../screens/privacy/PolicyScreen';

const MainStack = createNativeStackNavigator();

const GENERAL = [
  {
    name: ROUTE_NAMES.splashStack,
    component: Splash,
  },
  {
    name: ROUTE_NAMES.bottomTab,
    component: BottomTab,
  },
  {
    name: ROUTE_NAMES.courseSearch,
    component: CourseSearchScreen,
  },
  {
    name: ROUTE_NAMES.testSearch,
    component: TestSearchScreen,
  },
  {
    name: ROUTE_NAMES.offlineCourseSearchScreen,
    component: OfflineCourseSearchScreen,
  },
  {
    name: ROUTE_NAMES.taskSearch,
    component: TaskSearchScreen,
  },
  {
    name: ROUTE_NAMES.login,
    component: LoginScreen,
  },
  {
    name: ROUTE_NAMES.register,
    component: RegisterScreen,
  },
  {
    name: ROUTE_NAMES.recovery,
    component: RecoveryScreen,
  },
  {
    name: ROUTE_NAMES.reviews,
    component: ReviewsScreen,
  },
];
const PRIVATE = [
  {
    name: ROUTE_NAMES.lesson,
    component: LessonScreen,
  },
  {
    name: ROUTE_NAMES.testPreview,
    component: PreviewTestScreen,
  },
  {
    name: ROUTE_NAMES.testPass,
    component: CourseTestScreen,
  },
  {
    name: ROUTE_NAMES.courseTask,
    component: CourseTaskScreen,
  },
  {
    name: ROUTE_NAMES.kaspiBank,
    component: KaspiBankScreen,
  },
  {
    name: ROUTE_NAMES.operation,
    component: OperationScreen,
    initialParams: {
      type: null,
      operation: null,
    },
  },
  {
    name: ROUTE_NAMES.webViewer,
    component: WebViewerScreen,
    initialParams: {
      webViewer: null,
      type: null,
      mode: null,
    },
  },
  {
    name: ROUTE_NAMES.newsDetail,
    component: NewsDetailScreen,
  },
  {
    name: ROUTE_NAMES.myTestPass,
    component: ModuleTestScreen,
  },
  {
    name: ROUTE_NAMES.moduleTask,
    component: ModuleTaskScreen,
  },
  {
    name: ROUTE_NAMES.readJournal,
    component: ReadJournalScreen,
    initialParams: {
      readJournal: null,
    },
  },
  {
    name: ROUTE_NAMES.testCompleted,
    component: TestCompletedScreen,
  },
  {
    name: ROUTE_NAMES.moduleTestCompleted,
    component: ModuleTestCompletedScreen,
  },
  {
    name: ROUTE_NAMES.courseFinish,
    component: CourseCompletedScreen,
  },
  {
    name: ROUTE_NAMES.courseLeaveReview,
    component: WriteReviewScreen,
  },
  {
    name: ROUTE_NAMES.testResult,
    component: TestResultScreen,
  },
  {
    name: ROUTE_NAMES.ubtTest,
    component: UBTTestScreen,
  },
  {
    name: ROUTE_NAMES.ubtCompleted,
    component: UBTCompletedScreen,
  },
  {
    name: ROUTE_NAMES.ubtResult,
    component: UBTResultScreen,
  },
  {
    name: ROUTE_NAMES.notifications,
    component: NotificationsScreen,
  },
  {
    name: ROUTE_NAMES.privacy,
    component: PrivacyScreen,
  },
  {
    name: ROUTE_NAMES.privacyPolicy,
    component: PolicyScreen,
  },
];

const Navigation = () => {
  const {setSettings, setIsAuth, isAuth, setInitialStart, setIsRead} =
    useSettings();

  const [fetchSettings, isLoading, settingsError] = useFetching(async () => {
    const response = await MobileSettingsService.fetchSettings();
    setSettings(response.data?.data);

    const userToken = await getString(STORAGE.userToken);
    if (userToken) {
      setIsAuth(true);
      API_V2.defaults.headers[REQUEST_HEADERS.Authorization] =
        'Bearer ' + userToken;
    }

    const language = await getString(STORAGE.language);
    if (language) {
      strings.setLanguage(language);
      API_V2.defaults.headers[REQUEST_HEADERS.lang] = language;
    } else {
      strings.setLanguage('ru');
      API_V2.defaults.headers[REQUEST_HEADERS.lang] = 'ru';
    }

    const isInitialStart = await getObject(STORAGE.initialStart);
    if (isInitialStart === false) {
      setInitialStart(isInitialStart);
    }

    const isRead = await getObject(STORAGE.isRead);
    if (isRead !== null) {
      setIsRead(isRead);
    } else {
      setIsRead(true);
    }
    global.setIsRead = setIsRead;
  });

  useLayoutEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settingsError) {
      console.log(settingsError);
    }
  }, [settingsError]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {GENERAL.map((route, index) => (
          <MainStack.Screen
            name={route.name}
            component={route.component}
            key={index}
            options={{
              animation:
                route.name === ROUTE_NAMES.courseSearch ||
                route.name === ROUTE_NAMES.testSearch ||
                route.name === ROUTE_NAMES.taskSearch
                  ? 'fade_from_bottom'
                  : 'default',
              headerBackTitleVisible: false,

              headerShown:
                route.name === ROUTE_NAMES.login ||
                route.name === ROUTE_NAMES.register ||
                route.name === ROUTE_NAMES.recovery ||
                route.name === ROUTE_NAMES.reviews
                  ? true
                  : false,
            }}
            initialParams={route?.initialParams}
          />
        ))}
        {isAuth
          ? PRIVATE.map((route, index) => (
              <MainStack.Screen
                name={route.name}
                component={route.component}
                key={index}
                options={{
                  headerShown: true,
                  headerBackTitleVisible: false,
                }}
                initialParams={route?.initialParams}
              />
            ))
          : null}
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
