import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import UniversalView from '../components/view/UniversalView'
import { useFetching } from '../hooks/useFetching'
import { CourseService } from '../services/API'
import LoadingScreen from '../components/LoadingScreen'

const ReviewsScreen = (props) => {

    const id = props.route?.params?.id

    const [data, setData] = useState(null)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [fetchReviews, isFetching, fetchingError] = useFetching(async() => {
        const response = await CourseService.fetchReviews(id)
        setData(response.data?.data)
    })
    const [fetchNext, isFetchingNext, fetchingNextError] = useFetching(async() => {
        const response = await CourseService.fetchReviews(id, page)
        setData(prev => prev.concat(response.data?.data))
    })

    useEffect(() => {
        fetchReviews()
    }, [])

    useEffect(() => {
        if (page === 1) {
            fetchReviews()
        } else {
            fetchNext()
        }
    }, [page])

    useEffect(() => {
        if (fetchingError) {
            console.log(fetchingError)
        }
    }, [fetchingError])

    const onRefresh = () => {

    }

    const onEndReached = () => {
        if(page < lastPage && !isFetchingNext) {
            setPage(prev => prev + 1)
          }
    }

    if (isFetching) {
        return <LoadingScreen/>
    }

    return (
        <UniversalView>

        </UniversalView>
    )
}

export default ReviewsScreen