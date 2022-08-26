import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTE_NAMES} from './routes';
import LoginScreen from '../../screens/auth/LoginScreen';
import MenuScreen from '../../screens/bottomtab/profile/MenuScreen';
import RecoveryScreen from '../../screens/auth/RecoveryScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen';
import NewsScreen from '../../screens/news/NewsScreen';
import ProfileScreen from '../../screens/bottomtab/profile/ProfileScreen';
import {useSettings} from '../context/Provider';
import NewsDetailScreen from '../../screens/news/NewsDetailScreen';
import {setFontStyle} from '../../utils/utils';
import {strings} from '../../localization';
import HistoryScreen from '../../screens/HistoryScreen';
import ChangePassword from '../../screens/ChangePasswordScreen';
import ProfieEditScreen from '../../screens/ProfileEditScreen';
import ScheduleNavigator from './ScheduleNavigator';
import SettingsScreen from '../../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const MenuStack = () => {
  const {isAuth} = useSettings();

  const screens = [
    {
      id: '1',
      name: ROUTE_NAMES.menu,
      component: MenuScreen,
    },
    {
      id: '5',
      name: ROUTE_NAMES.news,
      component: NewsScreen,
      options: {
        title: strings.Новости,
      },
    },
    {
      id: '6',
      name: ROUTE_NAMES.profile,
      component: ProfileScreen,
      initialParams: {profile: false},
    },
    {
      id: '7',
      name: ROUTE_NAMES.newsDetail,
      component: NewsDetailScreen,
      options: {
        title: strings.Новость,
      },
    },
    {
      id: '8',
      name: ROUTE_NAMES.history,
      component: HistoryScreen,
      options: {
        title: strings['История оплаты'],
      },
    },
    {
      id: '9',
      name: ROUTE_NAMES.changePassword,
      component: ChangePassword,
      options: {
        title: strings['Сменить пароль'],
      },
    },
    {
      id: '10',
      name: ROUTE_NAMES.profileEdit,
      component: ProfieEditScreen,
      options: {
        title: strings['Редактировать профиль'],
      },
    },
    {
      id: '11',
      name: ROUTE_NAMES.scheduleNavigator,
      component: ScheduleNavigator,
      options: {
        title: strings['Редактировать профиль'],
      },
    },
    {
      id: '12',
      name: ROUTE_NAMES.settings,
      component: SettingsScreen,
      options: {
        title: strings.Настройки,
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
      }}>
      {screens.map(screen => (
        <Stack.Screen
          key={screen.id}
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
