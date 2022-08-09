import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import UniversalView from '../../components/view/UniversalView'
import { check } from '../../assets/icons'
import { APP_COLORS } from '../../constans/constants'
import { setFontStyle } from '../../utils/utils'
import { storeString } from '../../storage/AsyncStorage'
import { useFetching } from '../../hooks/useFetching'
import SelectOption from '../../components/SelectOption'
import SectionView from '../../components/view/SectionView'
import { strings } from '../../localization'

const languages = [ { label: "Русский" , key: "ru"}, { label: "Қазақша", key: "kz" }, { label: "English", key: "en" } ]

const LanguageScreen = ({ navigation, route }) => {

  const [ currentKey, setCurrentKey ] = useState(strings.getLanguage())
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
      <SectionView label={strings['Выберите язык']}/>
      {
        languages.map((value, index) => (
          <SelectOption
            selectKeyPressed={selectKeyPressed}
            value={value}
            currentKey={currentKey}
            isLoading={isLoading}
            key={index}
          />
        ))
      }
    </UniversalView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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