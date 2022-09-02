import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import UniversalView from '../components/view/UniversalView'
import { useFetching } from '../hooks/useFetching'
import LoadingScreen from '../components/LoadingScreen'

const TestRelatedScreen = () => {


    const [fetchCompltedTest, isFetching, fetchingError] = useFetching(async () => {

    })

    if (isFetching) {
        return <LoadingScreen/>
    }

    return (
        <UniversalView style={styles.container}>

        </UniversalView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "red"
    }
})

export default TestRelatedScreen