import React, {useEffect} from 'react';
import {useSettings} from '../context/Provider';
import {ROUTE_NAMES} from './routes';
import {
  coursesOFF,
  coursesON,
  coursesTabIcon,
  CoursesTabIcon,
  myCoursesOFF,
  myCoursesON,
  myCoursesTabIcon,
  profileOFF,
  profileON,
  profileTabIcon,
  tasksOFF,
  tasksON,
  tasksTabIcon,
  testsOFF,
  testsON,
  testsTabIcon,
} from '../../assets/icons';
import {strings} from '../../localization';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  APP_COLORS,
  NOTIFICATION_TYPE,
  N_STATUS,
} from '../../constans/constants';
import Courses from './CoursesStack';
import MenuStack from './MenuStack';
import Tests from './TestsStack';
import Tasks from './TasksStack';
import MyCourses from './MyCoursesStack';
import {firebaseService} from '../../services/FirebaseService';
import {useNavigation} from '@react-navigation/native';

const BottomTabStack = createBottomTabNavigator();

const BottomTab = props => {
  const onNotification = props.route?.params?.onNotification;
  const {settings, isAuth, nstatus} = useSettings();
  const {navigate} = useNavigation();

  const BOTTOM_TAB = [
    {
      name: ROUTE_NAMES.coursesStack,
      icon: coursesTabIcon,
      label: strings.Курсы,
      component: Courses,
    },
    {
      name: ROUTE_NAMES.testsStack,
      component: Tests,
      icon: testsTabIcon,
      label: strings.Тесты,
    },
    {
      name: ROUTE_NAMES.myCoursesStack,
      component: MyCourses,
      icon: myCoursesTabIcon,
      label: strings['Мои курсы'],
    },
    {
      name: ROUTE_NAMES.tasksStack,
      component: Tasks,
      icon: tasksTabIcon,
      label: strings.Задания,
    },
    {
      name: ROUTE_NAMES.menuStack,
      component: MenuStack,
      icon: profileTabIcon,
      label: strings.Меню,
    },
  ];

  const getInitialRouteName = () => {
    if (onNotification) {
      return ROUTE_NAMES.menuStack;
    }
    if (isAuth) {
      return ROUTE_NAMES.myCoursesStack;
    }
    return ROUTE_NAMES.coursesStack;
  };

  useEffect(() => {
    firebaseService.getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
        const notificationData = remoteMessage?.data;
        if (notificationData?.type === NOTIFICATION_TYPE.news) {
          console.log('type : ', notificationData?.type);
          navigate(ROUTE_NAMES.newsDetail, {newsId: notificationData?.id});
        } else {
          navigate(ROUTE_NAMES.bottomTab, {onNotification: true});
        }
      }
    });
  }, []);

  return (
    <BottomTabStack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: settings.color_app,
        tabBarInactiveTintColor: APP_COLORS.placeholder,
      }}
      initialRouteName={getInitialRouteName()}>
      {BOTTOM_TAB.map((route, index) => {
        const screen = (
          <BottomTabStack.Screen
            name={route.name}
            component={route.component}
            key={index}
            options={{
              tabBarIcon: ({focused}) => route.icon(focused, settings?.color_app),
              tabBarLabel: route.label,
            }}
          />
        );

        if (route.name === ROUTE_NAMES.testsStack) {
          if (nstatus !== N_STATUS && settings?.modules_enabled_tests) {
            return screen;
          } else {
            return null;
          }
        }
        // else if (route.name === ROUTE_NAMES.coursesStack) {
        //   if (settings?.modules_enabled_courses) {
        //     return screen
        //   } else {
        //     return null
        //   }
        // }
        else if (route.name === ROUTE_NAMES.tasksStack) {
          if (nstatus !== N_STATUS && settings?.modules_enabled_tasks) {
            return screen;
          } else {
            return null;
          }
        }

        return screen;
      })}
    </BottomTabStack.Navigator>
  );
};

export default BottomTab;
