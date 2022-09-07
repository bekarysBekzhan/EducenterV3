import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import UniversalView from '../components/view/UniversalView'
import { useFetching } from '../hooks/useFetching'
import { CourseService } from '../services/API'
import LoadingScreen from '../components/LoadingScreen'

const ReviewsScreen = (props) => {

    const [data, setData] = useState(null)
    const [fetchReviews, isFetching, fetchingError] = useFetching(async() => {
        const response = await CourseService.fetchCategories()
        setData(response.data?.data)
    })

    useEffect(() => {
        fetchReviews()
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
        <UniversalView>

        </UniversalView>
    )
}

export default ReviewsScreen