import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import UniversalView from '../components/view/UniversalView'
import { useFetching } from '../hooks/useFetching'
import { CourseService } from '../services/API'
import LoadingScreen from '../components/LoadingScreen'
import Question from '../components/test/Question'
import { RESULT_TYPES } from '../constans/constants'
import { strings } from '../localization'

const TestResultScreen = (props) => {

    const id = props.route?.params?.id
    const resultType = props.route?.params?.resultType

    const [data, setData] = useState(null)

    const [fetchResult, isFetching, fetchingError] = useFetching(async() => {
        const response = await CourseService.fetchTestResult(id)
        const questions = Object.values(response.data?.data?.questions)
        setData(questions)
    }, [])

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: strings['Результаты теста']
        })
        fetchResult()
    }, [])

    useEffect(() => {
        if (fetchingError) {
            console.log(fetchingError)
        }
    }, [fetchingError])

    const renderQuestion = ({ item, index }) => {
        return (
            <Question
                questionItem={item?.question}
                items={Object.values(item?.items)}
                index={index}
                is_multiple={item?.question?.is_multiple}
                resultType={resultType ? resultType : RESULT_TYPES.DEFAULT}
                disabledAnswer
            />
        )
    }

    if (isFetching) {
        return <LoadingScreen/>
    }
    return (
        <UniversalView style={styles.container}>
            <FlatList
                data={data}
                style={{ padding: 16 }}
                renderItem={renderQuestion}
                keyExtractor={(_, index) => index.toString()}
                maxToRenderPerBatch={10}
                initialNumToRender={12}
                windowSize={10}
                showsVerticalScrollIndicator={false}
            />
        </UniversalView>
    )
}

const styles = StyleSheet.create({
    container: {

    }
})

export default TestResultScreen