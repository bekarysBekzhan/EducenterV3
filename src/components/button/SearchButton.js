import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { search } from '../../assets/icons'
import { setFontStyle } from '../../utils/utils'
import { APP_COLORS } from '../../constans/constants'

const SearchButton = () => {
  return (
    <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
    >
        {search()}
        <Text style={styles.text}>Поиск курсов и тестов</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 14,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: APP_COLORS.input,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: "center"
    },
    text: [setFontStyle(15, "400", APP_COLORS.placeholder), {marginLeft: 15}]
})

export default SearchButton