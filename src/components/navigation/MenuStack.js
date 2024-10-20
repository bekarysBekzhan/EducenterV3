import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTE_NAMES } from './routes';
import MenuScreen from '../../screens/bottomtab/profile/MenuScreen';
import NewsScreen from '../../screens/news/NewsScreen';
import ProfileScreen from '../../screens/bottomtab/profile/ProfileScreen';
import { useSettings } from '../context/Provider';
import { setFontStyle } from '../../utils/utils';
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
import PrivacyScreen from '../../screens/privacy/PrivacyScreen';
import PolicyScreen from '../../screens/privacy/PolicyScreen';
import DeleteAccountScreen from '../../screens/deleteAccount/DeleteAccountScreen';
import { useLocalization } from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';
import { APP_COLORS } from '../../constants/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BellIcon, LeftArrowIcon, SearchIcon, SettingsIcon } from '../../assets/icons';
import UnauthorizedScreen from '../../screens/bottomtab/myCourses/UnauthorizedScreen';

const Stack = createNativeStackNavigator();

const MenuStack = ({ navigation }) => {
  const { localization } = useLocalization();
  const { isAuth, settings, isRead, setIsRead, nstatus } = useSettings();

  const screens = [
    {
      name: ROUTE_NAMES.menu,
      component: MenuScreen,
    },
    {
      name: ROUTE_NAMES.news,
      component: NewsScreen,
      options: {
        title: lang('Новости', localization),
      },
    },
    {
      name: ROUTE_NAMES.selectSubjects,
      component: SelectSubjectsScreen,
      options: {
        title: lang('ЕНТ', localization),
      },
    },
    {
      name: ROUTE_NAMES.profile,
      component: isAuth ? ProfileScreen : UnauthorizedScreen,
      options: {
        title: lang('Профиль', localization),
      },
      initialParams: { profile: false },
    },
    {
      name: ROUTE_NAMES.history,
      component: HistoryScreen,
      options: {
        title: lang('История оплаты', localization),
      },
    },
    {
      name: ROUTE_NAMES.changePassword,
      component: ChangePassword,
      options: {
        title: lang('Сменить пароль', localization),
      },
    },
    {
      name: ROUTE_NAMES.profileEdit,
      component: ProfieEditScreen,
      options: {
        title: lang('Редактировать профиль', localization),
      },
    },
    {
      name: ROUTE_NAMES.scheduleNavigator,
      component: ScheduleNavigator,
      options: {
        title: lang('Расписание', localization),
      },
    },
    {
      name: ROUTE_NAMES.settings,
      component: SettingsScreen,
      options: {
        title: lang('Настройки', localization),
      },
    },
    {
      name: ROUTE_NAMES.journalNavigator,
      component: JournalNavigator,
      options: {
        title: lang('Все журналы', localization),
      },
    },
    {
      name: ROUTE_NAMES.offlineCourses,
      component: OfflineCourseScreen,
      options: {
        title: lang('Офлайн курсы', localization),
        headerBackTitleVisible: false,
      },
    },
    {
      name: ROUTE_NAMES.offlineCalendar,
      component: CalendarScreen,
      options: {
        title: lang('Календарь', localization),
        headerBackTitleVisible: false,
      },
    },
    {
      name: ROUTE_NAMES.offlineCourseDetailsScreen,
      component: OfflineCourseDetailsScreen,
      options: {
        headerBackTitleVisible: false,
        headerTitle: lang('Курс', localization),
      },
    },
    {
      name: ROUTE_NAMES.offlineCourseMemberScreen,
      component: OfflineCourseMemberScreen,
      options: {
        title: lang('Участники курса', localization),
      },
    },
    {
      name: ROUTE_NAMES.courseMaterialScreen,
      component: CourseMaterialScreen,
      options: {
        title: lang('Материалы курса', localization),
      },
    },
    {
      name: ROUTE_NAMES.rating,
      component: RatingScreen,
      options: {
        title: lang('Рейтинг', localization),
      },
    },
    {
      name: ROUTE_NAMES.privacy,
      component: PrivacyScreen,
      options: {
        title: lang('Правила и соглашения', localization),
      },
    },
    {
      name: ROUTE_NAMES.privacyPolicy,
      component: PolicyScreen,
      options: {
        title: lang('Правила и соглашения', localization),
      },
    },
    {
      name: ROUTE_NAMES.deleteAccount,
      component: DeleteAccountScreen,
      options: {
        title: lang('Удалить аккаунт', localization),
      },
    },
  ];

  return (
    <Stack.Navigator
      initialRouteName={isAuth ? ROUTE_NAMES.profile : ROUTE_NAMES.menu}
      screenOptions={{
        headerShown: true,
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