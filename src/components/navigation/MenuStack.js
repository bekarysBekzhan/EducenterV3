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
      id: '2',
      name: ROUTE_NAMES.login,
      component: LoginScreen,
    },
    {
      id: '3',
      name: ROUTE_NAMES.recovery,
      component: RecoveryScreen,
    },
    {
      id: '4',
      name: ROUTE_NAMES.register,
      component: RegisterScreen,
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
        />
      ))}
    </Stack.Navigator>
  );
};

export default MenuStack;
