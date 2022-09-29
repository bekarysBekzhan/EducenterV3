import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import React from 'react'
import { WhatsappLogo } from '../../assets/icons'
import { useSettings } from '../context/Provider'
import { getWhatsappNumber } from '../../utils/utils'

const WhatsappButton = () => {

    const { settings } = useSettings()

    const onPress = () => {
        if (settings?.phone) {
            const whatsappURL = 'http://api.whatsapp.com/send?phone=' + getWhatsappNumber(settings?.phone)
            console.log("whatsappURL : " , whatsappURL);
            Linking.openURL(whatsappURL)
        }
    }

    if (!settings?.whatsapp_icon_enabled) { 
        return null
    }

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.88} onPress={onPress}>
            <WhatsappLogo/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        right: 0,
        margin: 16
    }
})

export default WhatsappButton