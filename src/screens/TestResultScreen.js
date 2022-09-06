import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import UniversalView from '../components/view/UniversalView'
import { useFetching } from '../hooks/useFetching'
import { CourseService } from '../services/API'
import LoadingScreen from '../components/LoadingScreen'

const TestResultScreen = (props) => {

    const [data, setData] = useState(null)
    const [fetchResult, isFetching, fetchingError] = useFetching(async() => {
        // const response = await CourseService.
    }, [])

    useLayoutEffect(() => {
        fetchResult()
    }, [])

    useEffect(() => {
        if (fetchingError) {
            console.log(fetchingError)
        }
    }, [fetchingError])

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

    }
})

export default TestResultScreen