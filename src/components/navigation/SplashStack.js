import { View, Text } from 'react-native'
import React from 'react'
import { ROUTE_NAMES } from './routes'
import SplashScreen from '../../screens/splash/SplashScreen'
import LanguageScreen from '../../screens/splash/LanguageScreen'
import { strings } from '../../localization'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const SplashStack = createNativeStackNavigator()

const SPLASH = [
    {
      name: ROUTE_NAMES.splash,
      component: SplashScreen
    },
    {
      name: ROUTE_NAMES.language,
      component: LanguageScreen
    }
  ]

const Splash = (props) => {
    return (
        <SplashStack.Navigator>
          {
             SPLASH.map((route, index) => (
              <SplashStack.Screen name={route.name} component={route.component} key={index} options={{ headerShown: route.name === ROUTE_NAMES.language, headerTitle: route.name === ROUTE_NAMES.language ? strings['Поменять язык'] : undefined }}/>
            ))
          }
        </SplashStack.Navigator>
      )
}

export default Splash