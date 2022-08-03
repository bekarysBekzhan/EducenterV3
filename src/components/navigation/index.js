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
              <MainStack.Screen name={route.name} component={route.component} key={index} initialParams={{ routes: route?.routes }}/>
            ))
          }
          {
            isAuth
            ?
            routes.private.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} initialParams={{ routes: route?.routes }}/>
            ))
            :
            routes.public.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} initialParams={{ routes: route?.routes }}/>
            ))
          }
        </MainStack.Navigator>
      </NavigationContainer>
  )
}

const SplashStack = createNativeStackNavigator()
const SplashNavigation = ({
  route, navigation
}) => {

  console.log("Splash route : " , route)
  console.log("Splash navigation : " , navigation)

  return (
    <SplashStack.Navigator>
      {

      }
    </SplashStack.Navigator>
  )
}

const BottomTabStack = createBottomTabNavigator()
const BottomTabBar = ({
  route, navigation
}) => {

  console.log("Splash route : " , route)
  console.log("Splash navigation : " , navigation)

  return(
    <BottomTabStack.Navigator>
      {

      }
    </BottomTabStack.Navigator>
  )
}

export  {Navigation, SplashNavigation, BottomTabBar}