import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { search } from '../../assets/icons'
import { setFontStyle } from '../../utils/utils'
import { APP_COLORS, WIDTH } from '../../constans/constants'
import { ROUTE_NAMES } from '../navigation/routes'
import { strings } from '../../localization'

const SearchButton = (props) => {
  return (
    <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate(ROUTE_NAMES.search)}
    >
        {search()}
        <Text style={styles.text}>{strings['Поиск курсов и тестов']}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH - 32,
        padding: 14,
        margin: 16,
        marginVertical: 8,
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