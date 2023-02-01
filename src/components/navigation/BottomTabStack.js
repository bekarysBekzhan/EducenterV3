import React, {useEffect} from 'react';
import {useSettings} from '../context/Provider';
import {ROUTE_NAMES} from './routes';
import {
  coursesTabIcon,
  coursesTabIcon2,
  coursesTabIcon3,
  myCoursesTabIcon,
  myCoursesTabIcon2,
  myCoursesTabIcon3,
  profileTabIcon,
  profileTabIcon2,
  profileTabIcon3,
  tasksTabIcon,
  tasksTabIcon2,
  tasksTabIcon3,
  testsTabIcon,
  testsTabIcon2,
  testsTabIcon3,
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
  const {settings, isAuth, nstatus, ndesign} = useSettings();
  const {navigate} = useNavigation();

  const coursesTabFunc = () => {
    if (ndesign === '1') {
      return coursesTabIcon2;
    } else if (ndesign === '2') {
      return coursesTabIcon3;
    }
    return coursesTabIcon;
  };

  const testTabFunc = () => {
    if (ndesign === '1') {
      return testsTabIcon2;
    } else if (ndesign === '2') {
      return testsTabIcon3;
    }
    return testsTabIcon;
  };

  const myCoursesTabFunc = () => {
    if (ndesign === '1') {
      return myCoursesTabIcon2;
    } else if (ndesign === '2') {
      return myCoursesTabIcon3;
    }
    return myCoursesTabIcon;
  };

  const taskTabFunc = () => {
    if (ndesign === '1') {
      return tasksTabIcon2;
    } else if (ndesign === '2') {
      return tasksTabIcon3;
    }
    return tasksTabIcon;
  };

  const profileTabFunc = () => {
    if (ndesign === '1' || ndesign === '2') {
      return profileTabIcon2;
    }
    return profileTabIcon;
  };

  const BOTTOM_TAB = [
    {
      name: ROUTE_NAMES.coursesStack,
      icon: coursesTabFunc(),
      label: strings.Курсы,
      component: Courses,
      options: {
        unmountOnBlur: true,
      },
    },
    {
      name: ROUTE_NAMES.testsStack,
      component: Tests,
      icon: testTabFunc(),
      label: strings.Тесты,
    },
    {
      name: ROUTE_NAMES.myCoursesStack,
      component: MyCourses,
      icon: myCoursesTabFunc(),
      label: strings['Мои курсы'],
    },
    {
      name: ROUTE_NAMES.tasksStack,
      component: Tasks,
      icon: taskTabFunc(),
      label: strings.Задания,
    },
    {
      name: ROUTE_NAMES.menuStack,
      component: MenuStack,
      icon: profileTabFunc(),
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
              ...route?.options,
              tabBarIcon: ({focused}) =>
                route.icon(focused, settings?.color_app),
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
