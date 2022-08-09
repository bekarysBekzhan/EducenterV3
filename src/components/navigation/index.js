import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { APP_COLORS } from '../../constans/constants'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFetching } from '../../hooks/useFetching'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { MobileSettingsService } from '../../services/API'
import { useSettings } from '../context/Provider'
import { ROUTE_NAMES } from "../navigation/routes"
import UniversalView from '../view/UniversalView'
import { getString } from '../../storage/AsyncStorage'
import { strings } from '../../localization'
import FastImage from 'react-native-fast-image'
import SplashScreen from '../../screens/splash/SplashScreen'
import LanguageScreen from '../../screens/splash/LanguageScreen'
import { coursesOFF, coursesON, myCoursesOFF, myCoursesON, profileOFF, profileON, tasksOFF, tasksON, testsOFF, testsON } from '../../assets/icons'
import CoursesScreen from '../../screens/bottomtab/courses/CoursesScreen'
import TestsScreen from '../../screens/bottomtab/tests/TestsScreen'
import MyCoursesScreen from '../../screens/bottomtab/myCourses/MyCoursesScreen'
import TasksScreen from '../../screens/bottomtab/tasks/TasksScreen'
import ProfileScreen from '../../screens/bottomtab/profile/ProfileScreen'
import { setFontStyle } from '../../utils/utils'

const MainStack = createNativeStackNavigator()
const SplashStack = createNativeStackNavigator()
const BottomTabStack = createBottomTabNavigator()

const GENERAL = [
  {
    name: ROUTE_NAMES.splashStack,
    component: SplashNavigation,
  }
]
const PUBLIC = [
  {
    name: ROUTE_NAMES.bottomTab,
    component: BottomTabBar
  }
]
const PRIVATE = [
  {

  }
].concat(PUBLIC)

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
            GENERAL.map((route, index) => (
              <MainStack.Screen name={route.name} component={SplashNavigation} key={index}/>
            ))
          }
          {
            isAuth
            ?
            PRIVATE.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} key={index}/>
            ))
            :
            PUBLIC.map((route, index) => (
              <MainStack.Screen name={route.name} component={BottomTabBar} key={index}/>
            ))
          }
        </MainStack.Navigator>
      </NavigationContainer>
  )
}

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

const SplashNavigation = (props) => {

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

const BottomTabBar = (props) => {

  const { settings } = useSettings()

  const BOTTOM_TAB = [
    {
      name: ROUTE_NAMES.coursesStack,
      icon: {
        active: coursesON,
        inactive: coursesOFF
      },
      label: strings.Курсы,
      component: CoursesScreen,
    },
    {
      name: ROUTE_NAMES.testsStack,
      component: TestsScreen,
      icon: {
        active: testsON,
        inactive: testsOFF
      },
      label: strings.Тесты, 
    },
    {
      name: ROUTE_NAMES.myCoursesStack,
      component: MyCoursesScreen,
      icon: {
        active: myCoursesON,
        inactive: myCoursesOFF,
      },
      label: strings['Мои курсы'],
    },
    {
      name: ROUTE_NAMES.tasksStack,
      component: TasksScreen,
      icon: {
        active: tasksON,
        inactive: tasksOFF
      },
      label: strings.Задания,
    },
    {
      name: ROUTE_NAMES.menuStack,
      component: ProfileScreen,
      icon: {
        active: profileON,
        inactive: profileOFF
      },
      label: strings.Профиль,
    }
  ]

  return(
    <BottomTabStack.Navigator>
      {
        BOTTOM_TAB.map((route, index) => {

          const screen = <BottomTabStack.Screen name={route.name} component={route.component} key={index} 
            options={{ 
              tabBarIcon: ({ focused }) => {
                return focused ? route.icon.active : route.icon.inactive
              }, 
              tabBarActiveTintColor: APP_COLORS.primary, 
              tabBarInactiveTintColor: APP_COLORS.placeholder, 
              tabBarLabel: route.label, 
              headerLeft: () => <FastImage source={{ uri: settings?.logo }} style={styles.logo}/>, 
              headerTitle: route.label,
              headerTitleAlign: "left",
              headerTitleStyle: styles.navigationTitle,
              headerLeftContainerStyle: styles.navigationHeader
            }}
          />

          if (route.name === ROUTE_NAMES.testsStack) {
            if (settings?.modules_enabled_tests) {
              return screen
            } else {
              return null
            }
          }
          // else if (route.name === ROUTE_NAMES.coursesStack) {
          //   if (settings?.modules_enabled_courses) {
          //     return screen
          //   } else {
          //     return null
          //   }
          // }
          else if (route.name === ROUTE_NAMES.tasksStack) {
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
    width: 38,
    height: 38,
    borderRadius: 6
  },
  navigationHeader: {
    paddingLeft: 16
  },
  navigationTitle: [setFontStyle(30, "700")]
})


export default Navigation