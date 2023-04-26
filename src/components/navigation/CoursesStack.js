import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTE_NAMES} from './routes';
import CoursesScreen from '../../screens/bottomtab/courses/CoursesScreen';
import CourseDetailScreen from '../../screens/bottomtab/courses/CourseDetailScreen';
import {useSettings} from '../context/Provider';
import {navHeaderOptions} from './navHeaderOptions';
import {useLocalization} from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';

const CoursesStack = createNativeStackNavigator();

const Courses = () => {
  const {localization} = useLocalization();

  const TITLE = lang('Курсы', localization);

  const screens = [
    {
      name: ROUTE_NAMES.courses,
      component: CoursesScreen,
    },
    {
      name: ROUTE_NAMES.courseDetail,
      component: CourseDetailScreen,
    },
  ];

  const {settings} = useSettings();

  return (
    <CoursesStack.Navigator>
      {screens.map((screen, index) => (
        <CoursesStack.Screen
          name={screen.name}
          component={screen.component}
          key={index}
          options={
            screen.name === ROUTE_NAMES.courses
              ? navHeaderOptions(settings?.logo, TITLE)
              : {
                  headerTitle: lang('Курс', localization),
                  headerBackTitleVisible: false,
                  headerTitleAlign: 'center',
                }
          }
        />
      ))}
    </CoursesStack.Navigator>
  );
};

export default Courses;
