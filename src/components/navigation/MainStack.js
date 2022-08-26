import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useFetching} from '../../hooks/useFetching';
import {MobileSettingsService} from '../../services/API';
import {useSettings} from '../context/Provider';
import {ROUTE_NAMES} from './routes';
import UniversalView from '../view/UniversalView';
import {getString} from '../../storage/AsyncStorage';
import Splash from './SplashStack';
import BottomTab from './BottomTabStack';
import LessonScreen from '../../screens/LessonScreen';
import Loader from '../Loader';
import {StyleSheet} from 'react-native';
import PreviewTestScreen from '../../screens/PreviewTestScreen';
import CourseTestScreen from '../../screens/CourseTestScreen';
import {API_V2} from '../../services/axios';
import CourseTaskScreen from '../../screens/CourseTaskScreen';
import {REQUEST_HEADERS} from '../../constans/constants';
import CourseSearchScreen from '../../screens/CourseSearchScreen';
import TestSearchScreen from '../../screens/TestSearchScreen';
import TaskSearchScreen from '../../screens/TaskSearchScreen';
import KaspiBankScreen from '../../screens/operation/KaspiBankScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
import Operation from '../../screens/operation/Operation';
import WebViewer from '../../screens/operation/WebViewer';

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
    name: ROUTE_NAMES.taskSearch,
    component: TaskSearchScreen,
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
    name: ROUTE_NAMES.login,
    component: LoginScreen,
  },
  {
    name: ROUTE_NAMES.operation,
    component: Operation,
    initialParams: {
      type: null,
      operation: null,
    },
  },
  {
    name: ROUTE_NAMES.webViewer,
    component: WebViewer,
    initialParams: {
      webViewer: null,
      type: null,
      mode: null,
    },
  },
];

const Navigation = () => {
  const {setSettings, setUserToken, setIsAuth, isAuth} = useSettings();

  const [fetchSettings, isLoading, settingsError] = useFetching(async () => {
    const auth = await getString('isAuth');
    const userToken = await getString('userToken');
    const response = await MobileSettingsService.fetchSettings();
    API_V2.defaults.headers.Authorization =
      'Bearer ehpzFyZOGazrc5QK9mByfj22XIdhpjkJwXCTI9ekypYTptlrj5YUr3s8pNZn';

    if (API_V2.defaults.headers[REQUEST_HEADERS.Authorization]?.length) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }

    if (userToken) {
      setUserToken(userToken);
    }
    setSettings(response.data?.data);
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <UniversalView style={styles.view}>
        <Loader />
      </UniversalView>
    );
  }
  return (
    <NavigationContainer>
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

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
