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
import CoursesScreen from '../../screens/bottomtab/courses/CoursesScreen';
import {strings} from '../../localization';
import TestsScreen from '../../screens/bottomtab/tests/TestsScreen';
import MyCoursesScreen from '../../screens/bottomtab/myCourses/MyCoursesScreen';
import TasksScreen from '../../screens/bottomtab/tasks/TasksScreen';
import ProfileScreen from '../../screens/bottomtab/profile/ProfileScreen';
import FastImage from 'react-native-fast-image';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import {setFontStyle} from '../../utils/utils';
import {APP_COLORS} from '../../constans/constants';
import Courses from './CoursesStack';

const BottomTabStack = createBottomTabNavigator();

const BottomTab = props => {
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
      component: TestsScreen,
      icon: {
        active: testsON,
        inactive: testsOFF,
      },
      label: strings.Тесты,
    },
    {
      name: ROUTE_NAMES.myCoursesStack,
      component: MyCoursesScreen,
      icon: {
        active: myCoursesON,
        inactive: myCoursesOFF,
      },
      label: strings['Мои курсы'],
    },
    {
      name: ROUTE_NAMES.tasksStack,
      component: TasksScreen,
      icon: {
        active: tasksON,
        inactive: tasksOFF,
      },
      label: strings.Задания,
    },
    {
      name: ROUTE_NAMES.menuStack,
      component: ProfileScreen,
      icon: {
        active: profileON,
        inactive: profileOFF,
      },
      label: strings.Профиль,
    },
  ];

  const {settings} = useSettings();

  return (
    <BottomTabStack.Navigator>
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
              tabBarActiveTintColor: APP_COLORS.primary,
              tabBarInactiveTintColor: APP_COLORS.placeholder,
              tabBarLabel: route.label,
              headerLeft: () => (
                <FastImage source={{uri: settings?.logo}} style={styles.logo} />
              ),
              headerTitle: route.label,
              headerTitleAlign: 'left',
              headerTitleStyle: styles.navigationTitle,
              headerLeftContainerStyle: styles.navigationHeader,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 6,
  },
  navigationHeader: {
    paddingLeft: 16,
  },
  navigationTitle: [setFontStyle(30, '700')],
});

export default BottomTab;
