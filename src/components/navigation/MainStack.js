import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useFetching} from '../../hooks/useFetching';
import {MobileSettingsService} from '../../services/API';
import {useSettings} from '../context/Provider';
import {ROUTE_NAMES} from './routes';
import UniversalView from '../view/UniversalView';
import {getString} from '../../storage/AsyncStorage';
import SearchScreen from '../../screens/SearchScreen';
import Splash from './SplashStack';
import BottomTab from './BottomTabStack';
import LessonScreen from '../../screens/LessonScreen';
import Loader from '../Loader';
import {StyleSheet} from 'react-native';
import PreviewTestScreen from '../../screens/PreviewTestScreen';
import CourseTestScreen from '../../screens/CourseTestScreen';
import { API_V2 } from '../../services/axios';

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
    name: ROUTE_NAMES.search,
    component: SearchScreen,
  },
];
const PRIVATE = [
  {
    name: ROUTE_NAMES.lesson,
    component: LessonScreen,
  },
  {
    name: ROUTE_NAMES.testPreview,
    component: PreviewTestScreen
  },
  {
    name: ROUTE_NAMES.testPass,
    component: CourseTestScreen
  }
];

const Navigation = () => {
  const {setSettings, setUserToken, setIsAuth, isAuth} = useSettings();

  const [fetchSettings, isLoading, settingsError] = useFetching(async () => {
    const auth = await getString('isAuth');
    const userToken = await getString('userToken');
    const response = await MobileSettingsService.fetchSettings();
    API_V2.defaults.headers.Authorization = "Bearer ehpzFyZOGazrc5QK9mByfj22XIdhpjkJwXCTI9ekypYTptlrj5YUr3s8pNZn"
    setIsAuth(true);
    // if (isAuth) {
    //   setIsAuth(true)
    // }
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
                route.name === ROUTE_NAMES.search
                  ? 'fade_from_bottom'
                  : 'default',
                headerBackTitleVisible: false
            }}
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
