import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTE_NAMES } from './routes';
import { useSettings } from '../context/Provider';
import UnauthorizedScreen from '../../screens/bottomtab/myCourses/UnauthorizedScreen';
import MyCoursesScreen from '../../screens/bottomtab/myCourses/MyCoursesScreen';
import MyCourseDetailScreen from '../../screens/bottomtab/myCourses/MyCourseDetailScreen';
import MyTestDetailScreen from '../../screens/bottomtab/myCourses/MyTestDetailScreen';
import { useLocalization } from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';
import SmallHeaderBar from '../../components/SmallHeaderBar'
import { setFontStyle } from '../../utils/utils';
import { APP_COLORS } from '../../constants/constants';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { LeftArrowIcon, SearchIcon } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';

const MyCoursesStack = createNativeStackNavigator();

const MyCourses = () => {
  const { localization } = useLocalization();
  const navigation = useNavigation();

  const TITLE = lang('Мои курсы', localization);
  const { settings, isAuth } = useSettings();

  const screens = [
    {
      name: ROUTE_NAMES.myCourses,
      component: isAuth ? MyCoursesScreen : UnauthorizedScreen,
    },
    {
      name: ROUTE_NAMES.myCourseDetail,
      component: MyCourseDetailScreen,
      title: lang('Мой курс', localization),
    },
    {
      name: ROUTE_NAMES.myTestDetail,
      component: MyTestDetailScreen,
      title: lang('Мой тест', localization),
    },
  ];

  return (
    <MyCoursesStack.Navigator>
      {screens.map((screen, index) => (
        <MyCoursesStack.Screen
          name={screen.name}
          component={screen.component}
          key={index}
          options={{
            headerShown: true,
            headerTitle: screen.name == ROUTE_NAMES.myCourseDetail ? lang('Курс', localization) : lang('Тест', localization),
            headerTitleAlign: 'center',
            headerTitleStyle: {
              ...setFontStyle(20, '700', APP_COLORS.white),
            },
            headerBackTitleVisible: true,
            headerStyle: {
              backgroundColor: settings?.color_app,
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.pop()}
                style={styles.iconButton}
                activeOpacity={0.65}
              >
                <LeftArrowIcon />
              </TouchableOpacity>
            ),
          }
          }
        />
      ))}
    </MyCoursesStack.Navigator>
  );
};

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

export default MyCourses;
