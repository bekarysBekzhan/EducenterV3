import React from 'react';
import {useSettings} from '../context/Provider';
import {ROUTE_NAMES} from './routes';
import {
  coursesOFF,
  coursesON,
  myCoursesOFF,
  myCoursesON,
  profileOFF,
  profileON,
  tasksOFF,
  tasksON,
  testsOFF,
  testsON,
} from '../../assets/icons';
import {strings} from '../../localization';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {APP_COLORS} from '../../constans/constants';
import Courses from './CoursesStack';
import MenuStack from './MenuStack';
import Tests from './TestsStack';
import Tasks from './TasksStack';
import MyCourses from './MyCoursesStack';

const BottomTabStack = createBottomTabNavigator();

const BottomTab = props => {
  const {settings} = useSettings();

  const BOTTOM_TAB = [
    {
      name: ROUTE_NAMES.coursesStack,
      icon: {
        active: coursesON,
        inactive: coursesOFF,
      },
      label: strings.Курсы,
      component: Courses,
    },
    {
      name: ROUTE_NAMES.testsStack,
      component: Tests,
      icon: {
        active: testsON,
        inactive: testsOFF,
      },
      label: strings.Тесты,
    },
    {
      name: ROUTE_NAMES.myCoursesStack,
      component: MyCourses,
      icon: {
        active: myCoursesON,
        inactive: myCoursesOFF,
      },
      label: strings['Мои курсы'],
    },
    {
      name: ROUTE_NAMES.tasksStack,
      component: Tasks,
      icon: {
        active: tasksON,
        inactive: tasksOFF,
      },
      label: strings.Задания,
    },
    {
      name: ROUTE_NAMES.menuStack,
      component: MenuStack,
      icon: {
        active: profileON,
        inactive: profileOFF,
      },
      label: strings.Меню,
    },
  ];

  return (
    <BottomTabStack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: APP_COLORS.primary,
        tabBarInactiveTintColor: APP_COLORS.placeholder,
      }}>
      {BOTTOM_TAB.map((route, index) => {
        const screen = (
          <BottomTabStack.Screen
            name={route.name}
            component={route.component}
            key={index}
            options={{
              tabBarIcon: ({focused}) => {
                return focused ? route.icon.active : route.icon.inactive;
              },
              tabBarLabel: route.label,
            }}
          />
        );

        if (route.name === ROUTE_NAMES.testsStack) {
          if (settings?.modules_enabled_tests) {
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
          if (settings?.modules_enabled_tasks) {
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
