import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { routes } from '../../constans/constants'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const MainStack = createNativeStackNavigator()

const Navigation = ({
    isAuth = false
}) => {

    return (
      <NavigationContainer>
        <MainStack.Navigator>
          {
            routes.general.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} key={index} />
            ))
          }
          {
            isAuth
            ?
            routes.private.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component}/>
            ))
            :
            routes.public.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component}/>
            ))
          }
        </MainStack.Navigator>
      </NavigationContainer>
  )
}

const SplashStack = createNativeStackNavigator()

const SplashNavigation = ({

}) => {
  return (
    <SplashStack.Navigator>
      <SplashStack.Screen/>
      <SplashStack.Screen/>
    </SplashStack.Navigator>
  )
}

const BottomTabStack = createBottomTabNavigator()

const BottomTabBar = ({

}) => {
  return(
    <BottomTabStack.Navigator>
      
    </BottomTabStack.Navigator>
  )
}

export default {Navigation, SplashNavigation, BottomTabBar}