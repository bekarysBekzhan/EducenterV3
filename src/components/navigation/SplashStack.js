import React from 'react';
import {ROUTE_NAMES} from './routes';
import SplashScreen from '../../screens/splash/SplashScreen';
import LanguageScreen from '../../screens/splash/LanguageScreen';
import {strings} from '../../localization';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const SplashStack = createNativeStackNavigator();

const Splash = props => {
  const screens = [
    {
      name: ROUTE_NAMES.splash,
      component: SplashScreen,
    },
    {
      name: ROUTE_NAMES.language,
      component: LanguageScreen,
    },
  ];

  return (
    <SplashStack.Navigator>
      {screens.map((screen, index) => (
        <SplashStack.Screen
          name={screen.name}
          component={screen.component}
          key={index}
          options={{
            headerShown: screen.name === ROUTE_NAMES.language,
            headerTitle:
              screen.name === ROUTE_NAMES.language
                ? strings['Поменять язык']
                : undefined,
          }}
        />
      ))}
    </SplashStack.Navigator>
  );
};

export default Splash;
