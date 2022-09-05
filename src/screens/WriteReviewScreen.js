import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'
import StarButton from '../components/StarButton'
import Input from '../components/Input'

const WriteReviewScreen = (props) => {
  return (
    <KeyboardAvoidingView style={styles.container}>
        <ScrollView>
            <StarButton/>
            <Input/>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }
})

export default WriteReviewScreen