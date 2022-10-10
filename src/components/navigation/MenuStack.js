import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTE_NAMES} from './routes';
import MenuScreen from '../../screens/bottomtab/profile/MenuScreen';
import NewsScreen from '../../screens/news/NewsScreen';
import ProfileScreen from '../../screens/bottomtab/profile/ProfileScreen';
import {useSettings} from '../context/Provider';
import {setFontStyle} from '../../utils/utils';
import {strings} from '../../localization';
import HistoryScreen from '../../screens/HistoryScreen';
import ChangePassword from '../../screens/ChangePasswordScreen';
import ProfieEditScreen from '../../screens/ProfileEditScreen';
import ScheduleNavigator from './ScheduleNavigator';
import SettingsScreen from '../../screens/SettingsScreen';
import JournalNavigator from './JournalNavigator';
import OfflineCourseScreen from '../../screens/offlineCourses/OfflineCourseScreen';
import CalendarScreen from '../../screens/offlineCourses/CalendarScreen';
import OfflineCourseDetailsScreen from '../../screens/offlineCourses/OfflineCourseDetailsScreen';
import CourseMaterialScreen from '../../screens/offlineCourses/CourseMaterialsScreen';
import OfflineCourseMemberScreen from '../../screens/offlineCourses/OfflineCourseMemberScreen';
import SelectSubjectsScreen from '../../screens/ubt/SelectSubjectsScreen';
import RatingScreen from '../../screens/RatingScreen';

const Stack = createNativeStackNavigator();

const MenuStack = ({navigation}) => {
  const {isAuth, settings} = useSettings();

  const screens = [
    {
      name: ROUTE_NAMES.menu,
      component: MenuScreen,
    },
    {
      name: ROUTE_NAMES.news,
      component: NewsScreen,
      options: {
        title: strings.Новости,
      },
    },
    {
      name: ROUTE_NAMES.selectSubjects,
      component: SelectSubjectsScreen,
      options: {
        title: settings?.modules_enabled_ubt_title,
      },
    },
    {
      name: ROUTE_NAMES.profile,
      component: ProfileScreen,
      initialParams: {profile: false},
    },
    {
      name: ROUTE_NAMES.history,
      component: HistoryScreen,
      options: {
        title: strings['История оплаты'],
      },
    },
    {
      name: ROUTE_NAMES.changePassword,
      component: ChangePassword,
      options: {
        title: strings['Сменить пароль'],
      },
    },
    {
      name: ROUTE_NAMES.profileEdit,
      component: ProfieEditScreen,
      options: {
        title: strings['Редактировать профиль'],
      },
    },
    {
      name: ROUTE_NAMES.scheduleNavigator,
      component: ScheduleNavigator,
      options: {
        title: strings['Редактировать профиль'],
      },
    },
    {
      name: ROUTE_NAMES.settings,
      component: SettingsScreen,
      options: {
        title: strings.Настройки,
      },
    },
    {
      name: ROUTE_NAMES.journalNavigator,
      component: JournalNavigator,
      options: {
        title: strings['Все журналы'],
      },
    },
    {
      name: ROUTE_NAMES.offlineCourses,
      component: OfflineCourseScreen,
      options: {
        title: strings['Офлайн курсы'],
        headerBackTitleVisible: false,
      },
    },
    {
      name: ROUTE_NAMES.offlineCalendar,
      component: CalendarScreen,
      options: {
        title: strings.Календарь,
        headerBackTitleVisible: false,
      },
    },
    {
      name: ROUTE_NAMES.offlineCourseDetailsScreen,
      component: OfflineCourseDetailsScreen,
      options: {
        headerBackTitleVisible: false,
        headerTitle: '',
      },
    },
    {
      name: ROUTE_NAMES.offlineCourseMemberScreen,
      component: OfflineCourseMemberScreen,
      options: {
        title: strings['Участники курса'],
      },
    },
    {
      name: ROUTE_NAMES.courseMaterialScreen,
      component: CourseMaterialScreen,
      options: {
        title: strings['Материалы курса'],
      },
    },
    {
      name: ROUTE_NAMES.rating,
      component: RatingScreen,
      options: {
        title: strings.Рейтинг,
      },
    },
  ];

  return (
    <Stack.Navigator
      initialRouteName={isAuth ? ROUTE_NAMES.profile : ROUTE_NAMES.menu}
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          ...setFontStyle(17, '600'),
        },
        headerBackTitleVisible: false,
      }}>
      {screens.map((screen, index) => (
        <Stack.Screen
          key={index?.toString()}
          name={screen.name}
          component={screen.component}
          options={screen.options}
          initialParams={screen?.initialParams}
        />
      ))}
    </Stack.Navigator>
  );
};

export default MenuStack;
