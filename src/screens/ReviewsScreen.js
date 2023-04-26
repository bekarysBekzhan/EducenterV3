import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import UniversalView from '../components/view/UniversalView'
import { useFetching } from '../hooks/useFetching'
import { CourseService } from '../services/API'
import LoadingScreen from '../components/LoadingScreen'
import { APP_COLORS, WIDTH } from '../constans/constants'
import { FlatList } from 'react-native'
import Empty from '../components/Empty'
import ReviewItem from '../components/view/ReviewItem'
import RowView from '../components/view/RowView'
import { setFontStyle, wordLocalization } from '../utils/utils'
import RatingStar from '../components/RatingStar'
import { useLocalization } from '../components/context/LocalizationProvider'
import { lang } from '../localization/lang'

const ReviewsScreen = (props) => {
    const {localization} = useLocalization();

    const id = props.route?.params?.id

    const [course, setCourse] = useState(null)
    const [reviews, setReviews] = useState(null)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    const [fetchReviews, isFetching, fetchingError] = useFetching(async() => {
        const response = await CourseService.fetchReviews(id)
        setCourse(response.data?.data?.course)
        setReviews(response.data?.data?.reviews?.data)
        setLastPage(response.data?.data?.reviews?.last_page)
    })
    const [fetchNext, isFetchingNext, fetchingNextError] = useFetching(async() => {
        const response = await CourseService.fetchReviews(id, page)
        setReviews(prev => prev.concat(response.data?.data?.reviews?.data))
    })

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: lang('Отзывы', localization)
        })
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
        if (fetchingNextError) {
            console.log(fetchingNextError)
        }
    }, [fetchingError, fetchingError])

    const renderHeader = () => {
        return (
            <RowView style={styles.header}>
                <Text style={styles.rating}>{course?.rating}</Text>
                <View style={styles.ratingInfo}>
                    <RatingStar 
                        disabled={true} 
                        maxStars={5} 
                        rating={parseFloat(course?.rating)}
                        halfStarEnabled={true}
                        starSize={32}
                    />
                    <Text style={styles.reviewCount}>{wordLocalization(lang('Оставлено :num отзывов', localization), { num: course?.reviews_count })}</Text>
                </View>
            </RowView>
        )
    }

    const renderReview = ({ item, index }) => {
        return (
            <ReviewItem
                avatar={item?.user?.avatar}
                name={item?.user?.name}
                date={item?.added_at}
                rating={item?.stars}
                startRating={item?.stars}
                review={item?.text}
                style={styles.reviewItem}
                // numberOfLines={3}
            />
        )
    }

    const renderFooter = () => {
        return (
            <View style={styles.footer}>
                {
                    isFetchingNext
                    ?
                    <ActivityIndicator color={APP_COLORS.primary}/>
                    :
                    null
                }
            </View>
        )
    }

    const onRefresh = () => {
        if (page === 1) {
            fetchReviews()
        }
        setPage(1)
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
        <UniversalView style={styles.container}>
            <FlatList
                data={reviews}
                renderItem={renderReview}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={() => <Empty/>}
                ListFooterComponent={renderFooter}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                onRefresh={onRefresh}
                onEndReached={onEndReached}
                refreshing={isFetching}
            />
        </UniversalView>
    )
}

const styles = StyleSheet.create({
    container: {
        // paddingVertical: 16
    },
    header: {
        padding: 16,
        borderBottomWidth: 0.75,
        borderColor: APP_COLORS.border,
        alignItems: "center",
        marginBottom: 16
    },
    ratingInfo: {
        flex: 1,
        alignItems: "flex-start",
    },
    rating: {
        ...setFontStyle(40, "700"),
        marginRight: 16
    },
    reviewCount: {
        ...setFontStyle(14, "400"),
        marginLeft: 8
    },
    reviewItem: {
        width: WIDTH - 32,
        alignSelf: "center",
        marginBottom: 8
    },
    footer: {
        width: WIDTH - 32,
        height: 30,
        justifyContent: "center",
        alignItems: 'center'
    }
})

export default ReviewsScreen