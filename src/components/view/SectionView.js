import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { APP_COLORS } from '../../constans/constants'
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
        backgroundColor: APP_COLORS.input,
        padding: 16,
        paddingVertical: 14
    },
    text: [setFontStyle(13, "400", APP_COLORS.placeholder)],
})

export default SectionView