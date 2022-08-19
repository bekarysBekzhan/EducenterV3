import { View, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { APP_COLORS } from '../../constans/constants'

const Overlay = ({ visible }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.container}>
            <View style={styles.view}>
                <ActivityIndicator size={"large"} color={APP_COLORS.primary}/>
            </View>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    view: {
        width: 120,
        height: 120,
        borderRadius: 10,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    }
})

export default Overlay