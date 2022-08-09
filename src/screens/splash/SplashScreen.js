import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import UniversalView from '../../components/view/UniversalView'
import { useSettings } from '../../components/context/Provider'
import { setFontStyle } from '../../utils/utils'
import { APP_COLORS } from '../../constans/constants'
import SimpleButton from '../../components/button/SimpleButton'
import OutlineButton from '../../components/button/OutlineButton'
import { ROUTE_NAMES } from '../../components/navigation/routes'
import FastImage from 'react-native-fast-image'
import { strings } from '../../localization'

const SplashScreen = ({navigation, route}) => {

  const { settings } = useSettings()

  useEffect(() => {
    
  }, [])

  const keepGoingPressed = () => {
    navigation.replace(ROUTE_NAMES.bottomTab)
  }

  const changeLanguagePressed = () => {
    console.log("changeLanguagePressed")
    navigation.navigate(ROUTE_NAMES.language)
  }

  return (
    <UniversalView
      style={styles.container}
    >
      <View style={styles.section1}/>
      <View
        style={styles.section2}
      >
        <FastImage
          style={styles.logo}
          source={{ uri: settings?.logo }}
        />
        <Text style={styles.description}>{settings?.description}</Text>
      </View>
      <View style={styles.section3}>
        <SimpleButton text={strings['Продолжить на русском']} style={styles.simpleButton} onPress={keepGoingPressed}/>
        <OutlineButton text={strings['Поменять язык']} style={styles.outlineButton} onPress={changeLanguagePressed}/>
      </View>
      <View
        style={styles.section4}
      >
        <Text style={{textAlign: 'center'}}>
          <Text style={setFontStyle(12, "400", APP_COLORS.placeholder)}>Продолжая вы соглашаетесь с </Text>
          <Text style={setFontStyle(12, "400", APP_COLORS.primary)} onPress={() => {}}>Пользовательским соглашением</Text>
        </Text>
      </View>
    </UniversalView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  section1: {
    flex: 5,
    width: "100%"
  },
  section2: {
    flex: 6,
    alignItems: 'center',
    width: "100%",
  },
  section3: {
    flex: 3,
    width: "100%",
  },  
  section4: {
    flex: 1,
    width: "100%",
  },
  description: [setFontStyle(21, "700"), {
    textAlign: 'center',
    marginTop: 15
  }],
  simpleButton: {
    paddingVertical: 16
  },
  outlineButton: {
    borderWidth: 0, 
    marginTop: 10, 
    paddingVertical: 16
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10
  }
})

export default SplashScreen