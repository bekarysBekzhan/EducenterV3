import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useFetching } from '../../hooks/useFetching'
import { MobileSettingsService } from '../../services/API'
import { useSettings } from '../context/Provider'
import { ROUTE_NAMES } from "./routes"
import UniversalView from '../view/UniversalView'
import { getString } from '../../storage/AsyncStorage'
import { strings } from '../../localization'
import SearchScreen from '../../screens/SearchScreen'
import Splash from './SplashStack'
import BottomTab from './BottomTabStack'

const MainStack = createNativeStackNavigator()

const GENERAL = [
  {
    name: ROUTE_NAMES.splashStack,
    component: Splash,
  },
  {
    name: ROUTE_NAMES.bottomTab,
    component: BottomTab
  },
  {
    name: ROUTE_NAMES.search,
    component: SearchScreen
  },
]
const PRIVATE = [
  {

  }
]

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
              <MainStack.Screen name={route.name} component={route.component} key={index}/>
            ))
          }
          {
            isAuth
            ?
            PRIVATE.map((route, index) => (
              <MainStack.Screen name={route.name} component={route.component} key={index}/>
            ))
            :
            null
          }
        </MainStack.Navigator>
      </NavigationContainer>
  )
}

export default Navigation