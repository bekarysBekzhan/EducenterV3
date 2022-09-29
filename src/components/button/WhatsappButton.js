import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { WhatsappLogo } from '../../assets/icons'

const WhatsappButton = () => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.88}>
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