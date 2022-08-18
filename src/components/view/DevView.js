import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { strings } from '../../localization'
import { setFontStyle } from '../../utils/utils'
import { APP_COLORS } from '../../constans/constants'
import { getVersion } from 'react-native-device-info'

const DevView = () => {
    return (
        <View style={styles.view}>
            <Text style={styles.text}>© {new Date().getFullYear()} • {strings['Создай свою онлайн школу вместе с Educenter']}</Text>
            <Text style={styles.version}>{strings['Версия приложения']} {getVersion()}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        paddingTop: 24,
        paddingBottom: 16,
        paddingHorizontal: 16
    },
    text: {
        textAlign: 'center',
        ...setFontStyle(13, '400', APP_COLORS.placeholder),
        marginBottom: 8
    },
    version: {
        textAlign: 'center',
        ...setFontStyle(13, '400', APP_COLORS.placeholder)
    }
})

export default DevView