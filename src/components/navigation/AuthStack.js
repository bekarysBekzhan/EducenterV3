import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTE_NAMES} from './routes';
import LoginScreen from '../../screens/auth/LoginScreen';
import MenuScreen from '../../screens/bottomtab/profile/MenuScreen';
import RecoveryScreen from '../../screens/auth/RecoveryScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
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
  ];

  return (
    <Stack.Navigator>
      {screens.map(screen => (
        <Stack.Screen
          key={screen.id}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default AuthStack;
