import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTES } from '../../constans/constants'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const MainStack = createNativeStackNavigator()
const Navigation = ({
    isAuth = false
}) => {

    return (
      <NavigationContainer>
        <MainStack.Navigator>
          {
            ROUTES.general.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} key={index} initialParams={{ ROUTES: route?.ROUTES }}/>
            ))
          }
          {
            isAuth
            ?
            ROUTES.private.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} initialParams={{ ROUTES: route?.ROUTES }}/>
            ))
            :
            ROUTES.public.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} initialParams={{ ROUTES: route?.ROUTES }}/>
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

  return (
    <SplashStack.Navigator>
      {
        route?.params?.ROUTES.map((route, index) => (
          <SplashStack.Screen name={route.name} component={route.component} key={index}/>
        ))
      }
    </SplashStack.Navigator>
  )
}

const BottomTabStack = createBottomTabNavigator()
const BottomTabBar = ({
  route, navigation
}) => {

  return(
    <BottomTabStack.Navigator>
      {
        route?.params?.ROUTES.map((route, index) => (
          <BottomTabStack.Screen name={route.name} component={route.component} key={index}/>
        ))
      }
    </BottomTabStack.Navigator>
  )
}

export  {Navigation, SplashNavigation, BottomTabBar}