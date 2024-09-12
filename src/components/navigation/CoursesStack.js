import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTE_NAMES } from './routes';
import CoursesScreen from '../../screens/bottomtab/courses/CoursesScreen';
import CourseDetailScreen from '../../screens/bottomtab/courses/CourseDetailScreen';
import { useSettings } from '../context/Provider';
import { useLocalization } from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';
import { setFontStyle } from '../../utils/utils';
import { APP_COLORS } from '../../constants/constants';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SearchIcon } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';

const CoursesStack = createNativeStackNavigator();

const Courses = () => {
  const { localization } = useLocalization();
  const navigation = useNavigation();

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

  const { settings } = useSettings();

  return (
    <CoursesStack.Navigator>
      {screens.map((screen, index) => (
        <CoursesStack.Screen
          name={screen.name}
          component={screen.component}
          key={index}
          options={{
            headerTitle: lang('Курсы', localization),
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerShown: true,
            headerTitleStyle: {
              ...setFontStyle(20, '700', APP_COLORS.white),
            },
            headerStyle: { backgroundColor: APP_COLORS.primary },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate(route, { filters })}
                style={styles.iconButton}
                activeOpacity={0.65}
              >
                <SearchIcon />
              </TouchableOpacity>
            )
          }
          }
        />
      ))}
    </CoursesStack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
    backgroundColor: '#FFFFFF33',
    borderRadius: 31,
    width: 36,
    height: 36,
    paddingTop: 9,
    gap: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
})

export default Courses;
