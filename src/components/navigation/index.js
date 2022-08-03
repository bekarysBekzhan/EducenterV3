import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { APP_COLORS, ROUTES, ROUTE_NAMES } from '../../constans/constants'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFetching } from '../hooks/useFetching'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { MobileSettingsService } from '../../services/API'

const MainStack = createNativeStackNavigator()
const Navigation = ({
    isAuth = false
}) => {
    return (
      <NavigationContainer>
        <MainStack.Navigator
          screenOptions={{
            headerShown: false  
          }}
        >
          {
            ROUTES.general.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} key={index} initialParams={{ ROUTES: route?.ROUTES }}/>
            ))
          }
          {
            isAuth
            ?
            ROUTES.private.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} key={index} initialParams={{ ROUTES: route?.ROUTES }}/>
            ))
            :
            ROUTES.public.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} key={index} initialParams={{ ROUTES: route?.ROUTES }}/>
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
    <SplashStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
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

  const [data, setData] = useState(null)
  const [fetchSettings, isLoading, settingsError] = useFetching(async() => {
    const response  = await MobileSettingsService.fetchSettings()
    setData(response.data?.data)
  })

  useEffect(() => {
    console.log("index.js")
    fetchSettings()
  }, [])

  if (isLoading) {
    return (
      <View
        style={styles.container}
      >
        <ActivityIndicator color={APP_COLORS.primary}/>
      </View>
    )
  } 
  return(
    <BottomTabStack.Navigator>
      {
        route?.params?.ROUTES.map((route, index) => {

          const screen = <BottomTabStack.Screen name={route.name} component={route.component} key={index}/>

          if (route.name === ROUTE_NAMES.coursesStack) {
            if (data?.modules_enabled_courses) {
              return screen
            } else {
              return null
            }
          } else if (route.name === ROUTE_NAMES.testsStack) {
            if (data?.modules_enabled_tests) {
              return screen
            } else {
              return null
            }
          } else if (route.name === ROUTE_NAMES.tasksStack) {
            if (data?.modules_enabled_tasks) {
              return screen
            } else {
              return null
            }
          }
          
          return screen
        })
      }
    </BottomTabStack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export  {Navigation, SplashNavigation, BottomTabBar}