import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { APP_COLORS } from '../../constants/constants'
import { setFontStyle } from '../../utils/utils'

const SectionView = ({label}) => {
  return (
    <View
        style={styles.container}
    >
        <Text style={styles.text}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: APP_COLORS.white,
        padding: 16,
    },
    text: {
      ...setFontStyle(14, "400", APP_COLORS.darkgray),
      textTransform: 'uppercase',
      letterSpacing: 0.2,
    },
})

export default SectionView



