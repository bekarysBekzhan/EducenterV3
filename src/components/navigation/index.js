import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { APP_COLORS } from '../../constans/constants'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFetching } from '../../hooks/useFetching'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { MobileSettingsService } from '../../services/API'
import { useSettings } from '../context/Provider'
import { ROUTES, ROUTE_NAMES } from "../navigation/routes"
import UniversalView from '../view/UniversalView'
import { getString } from '../../storage/AsyncStorage'
import { strings } from '../../localization'
import FastImage from 'react-native-fast-image'

const MainStack = createNativeStackNavigator()
const SplashStack = createNativeStackNavigator()
const BottomTabStack = createBottomTabNavigator()

const Navigation = () => {

  const { setSettings, setUserToken, setIsAuth, isAuth } = useSettings()

  const [fetchSettings, isLoading, settingsError] = useFetching(async() => {
    const language = await getString("language")
    if (language) {
      console.log(language)
      strings.setLanguage(language)
    } else {
      console.log("strings.setLanguage(ru)")
      strings.setLanguage("ru")
    }
    const isAuth = await getString("isAuth")
    const userToken = await getString("userToken")
    const response = await MobileSettingsService.fetchSettings()
    if (isAuth) {
      setIsAuth(true)
    }
    if(userToken) {
      setUserToken(userToken)
    }
    setSettings(response.data?.data)
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  if (isLoading) {
    return <UniversalView style={{ flex: 1 }}/>
  }
    return (
      <NavigationContainer>
        <MainStack.Navigator
          screenOptions={{
            headerShown: false  
          }}
        >
          {
            ROUTES.general.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} key={index} initialParams={{ ROUTES: route?.ROUTES}}/>
            ))
          }
          {
            isAuth
            ?
            ROUTES.private.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} key={index} initialParams={{ ROUTES: route?.ROUTES}}/>
            ))
            :
            ROUTES.public.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} key={index} initialParams={{ ROUTES: route?.ROUTES}}/>
            ))
          }
        </MainStack.Navigator>
      </NavigationContainer>
  )
}

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
          <SplashStack.Screen name={route.name} component={route.component} key={index} options={{ headerShown: route.name === ROUTE_NAMES.language, headerTitle: route.name === ROUTE_NAMES.language ? strings['Поменять язык'] : undefined }}/>
        ))
      }
    </SplashStack.Navigator>
  )
}


const BottomTabBar = ({
  route, navigation
}) => {

  const { settings } = useSettings()

  return(
    <BottomTabStack.Navigator>
      {
        route?.params?.ROUTES.map((route, index) => {

          const screen = <BottomTabStack.Screen name={route.name} component={route.component} key={index} 
            options={{ 
              tabBarIcon: ({ focused }) => {
                return focused ? route.icon.active : route.icon.inactive
              }, 
              tabBarActiveTintColor: APP_COLORS.primary, 
              tabBarInactiveTintColor: APP_COLORS.placeholder, 
              tabBarLabel: route.label, 
              headerLeft: () => <FastImage source={{ uri: settings?.logo }} style={styles.logo}/>, 
              headerTitle: route.label}}
          />

          if (route.name === ROUTE_NAMES.coursesStack) {
            if (settings?.modules_enabled_courses) {
              return screen
            } else {
              return null
            }
          } else if (route.name === ROUTE_NAMES.testsStack) {
            if (settings?.modules_enabled_tests) {
              return screen
            } else {
              return null
            }
          } else if (route.name === ROUTE_NAMES.tasksStack) {
            if (settings?.modules_enabled_tasks) {
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
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 6
  }
})

export {Navigation, SplashNavigation, BottomTabBar}