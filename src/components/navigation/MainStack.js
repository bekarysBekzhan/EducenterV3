import React, { useEffect, useLayoutEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFetching } from '../../hooks/useFetching';
import { MobileSettingsService, SettingsService } from '../../services/API';
import { useSettings } from '../context/Provider';
import { ROUTE_NAMES } from './routes';
import { getObject, getString } from '../../storage/AsyncStorage';
import Splash from './SplashStack';
import BottomTab from './BottomTabStack';
import LessonScreen from '../../screens/LessonScreen';
import PreviewTestScreen from '../../screens/PreviewTestScreen';
import CourseTestScreen from '../../screens/CourseTestScreen';
import { API_V2 } from '../../services/axios';
import CourseTaskScreen from '../../screens/CourseTaskScreen';
import { APP_COLORS, REQUEST_HEADERS, STORAGE } from '../../constants/constants';
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
import { navigationRef } from './RootNavigation';
import NewsDetailScreen from '../../screens/news/NewsDetailScreen';
import OfflineCourseSearchScreen from '../../screens/OfflineCourseSearchScreen';
import NotificationsScreen from '../../screens/NotificationsScreen';
import ModuleTaskScreen from '../../screens/ModuleTaskScreen';
import PrivacyScreen from '../../screens/privacy/PrivacyScreen';
import PolicyScreen from '../../screens/privacy/PolicyScreen';
import { Platform, StyleSheet } from 'react-native';
import { useLocalization } from '../context/LocalizationProvider';
import { strings } from '../../localization';
import { setFontStyle } from '../../utils/utils';
import { TouchableOpacity } from 'react-native';
import { LeftArrowIcon } from '../../assets/icons';

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
  {
    name: ROUTE_NAMES.privacy,
    component: PrivacyScreen,
  },
  {
    name: ROUTE_NAMES.privacyPolicy,
    component: PolicyScreen,
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
    initialParams: {
      onNotification: false,
      newsId: null,
    },
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
];

const Navigation = () => {
  const {
    setSettings,
    setIsAuth,
    isAuth,
    setInitialStart,
    setIsRead,
    setNstatus,
    setLanguage,
    setNCourse,
    setNMyCourse,
    setNIcon,
    settings,
  } = useSettings();

  const { localization } = useLocalization();

  const [fetchSettings, isLoading, settingsError] = useFetching(async () => {
    const response = await MobileSettingsService.fetchSettings();
    setSettings(response.data?.data);

    const status = await MobileSettingsService.getStatus();
    setNstatus(status.data[Platform.OS]);
    setNCourse(status.data['courses']);
    setNMyCourse(status.data['my_courses']);
    setNIcon(status.data['icon']);

    const userToken = await getString(STORAGE.userToken);
    if (userToken) {
      setIsAuth(true);
      API_V2.defaults.headers[REQUEST_HEADERS.Authorization] =
        'Bearer ' + userToken;
    }

    const lang = await getString(STORAGE.language);
    const langDB = await SettingsService.fetchLanguage();

    if (lang) {
      if (langDB?.data?.data) {
        localization.current = langDB?.data?.data[lang];
      }
      strings.setLanguage(lang);
      setLanguage(lang);
      API_V2.defaults.headers[REQUEST_HEADERS.lang] = lang;
    } else {
      strings.setLanguage('ru');
      API_V2.defaults.headers[REQUEST_HEADERS.lang] = 'ru';
      localization.current = langDB?.data?.data['ru'];
    }

    const isInitialStart = await getObject(STORAGE.initialStart);
    if (isInitialStart == false) {
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

  if (isLoading || settingsError) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
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
                  route.name === ROUTE_NAMES.reviews ||
                  route.name === ROUTE_NAMES.privacy ||
                  route.name === ROUTE_NAMES.privacyPolicy
                  ? true
                  : false,
              headerStyle: {
                backgroundColor: settings?.color_app,
              },
              headerTitleStyle: {
                ...setFontStyle(20, '700', APP_COLORS.white),
              },
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
                headerStyle: {
                  backgroundColor: settings?.color_app,
                },
                headerTitleStyle: {
                  ...setFontStyle(20, '700', APP_COLORS.white),
                },
                headerShadowVisible: false,
                headerLeft: () => {
                  const navigation = useNavigation();

                  return (
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={styles.iconButton}
                      activeOpacity={0.65}
                    >
                      <LeftArrowIcon />
                    </TouchableOpacity>
                  );
                },
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

const styles = StyleSheet.create({
  iconButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
    backgroundColor: '#FFFFFF33',
    borderRadius: 31,
    width: 36,
    height: 36,
    paddingTop: 9,
    gap: 16,
    alignItems: 'center',
  },
})


// headerShown: true,
// headerTitle: lang('Тесты', localization),
// headerTitleAlign: 'center',
// headerTitleStyle: {
//   ...setFontStyle(20, '700', APP_COLORS.white),
// },
// headerBackTitleVisible: true,
// headerStyle: {
//   backgroundColor: APP_COLORS.primary,
// },
// headerShadowVisible: false,
// headerLeft: () => (
//   <TouchableOpacity
//     onPress={() => navigation.pop()}
//     style={styles.iconButton}
//     activeOpacity={0.65}
//   >
//     <LeftArrowIcon />
//   </TouchableOpacity>
// ),