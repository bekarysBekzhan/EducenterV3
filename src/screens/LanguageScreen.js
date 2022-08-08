import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import UniversalView from '../components/view/UniversalView'
import { check } from '../assets/icons'
import { APP_COLORS } from '../constans/constants'
import { setFontStyle } from '../utils/utils'
import { storeString } from '../storage/AsyncStorage'
import { useFetching } from '../components/hooks/useFetching'

const languages = [ { label: "Русский" , key: "ru"}, { label: "Қазақша", key: "kz" }, { label: "English", key: "en" } ]

const LanguageScreen = ({ navigation, route }) => {

  const [ currentKey, setCurrentKey ] = useState("ru")
  const [selectKeyPressed, isLoading, keyError] = useFetching(async(key) => {
    console.log("key : " , key)
    if (currentKey !== key) {
      await storeString("language", key)
      setCurrentKey(key)
    }
  })

  return (
    <UniversalView
      style={styles.container}
    >
      <View
        style={styles.actionContainer}
      >
        <Text style={styles.actionText}>Выберите язык</Text>
      </View>
      {
        languages.map((value, index) => (
          <TouchableOpacity
            style={styles.label}
            onPress={() => selectKeyPressed(value.key)}
            activeOpacity={0.78}
            key={index}
            disabled={isLoading}
          >
            <Text style={styles.labelText}>{value.label}</Text>
            <View
              style={[styles.box, { backgroundColor: value.key === currentKey ? APP_COLORS.primary : "white" }]}
            >
              {check(1.3)}
            </View>
          </TouchableOpacity>
        ))
      }
    </UniversalView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  actionContainer: {
    width: "100%",
    backgroundColor: APP_COLORS.input,
    padding: 16,
    paddingVertical: 14
  },
  actionText: [setFontStyle(13, "400", APP_COLORS.placeholder)],
  label: {
    width: "100%",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    borderBottomWidth: 0.75,
    borderColor: APP_COLORS.input
  },
  labelText: [setFontStyle(16, "400")],
  box: {
    padding: 6,
    paddingVertical: 7,
    borderRadius: 100,
  }
})

export default LanguageScreen