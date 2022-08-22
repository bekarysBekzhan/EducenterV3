import {ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import UniversalView from './view/UniversalView'
import { APP_COLORS } from '../constans/constants'

const LoadingScreen = () => {
  return (
    <UniversalView style={styles.container}>
        <ActivityIndicator color={APP_COLORS.primary}/>
    </UniversalView>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    }
})

export default LoadingScreen