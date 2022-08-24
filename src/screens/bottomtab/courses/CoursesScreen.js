import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React from 'react'
import UniversalView from '../../../components/view/UniversalView'
import SearchButton from '../../../components/button/SearchButton'
import { useFetching } from '../../../hooks/useFetching'
import { CourseService } from '../../../services/API'
import { useState } from 'react'
import { APP_COLORS, WIDTH } from '../../../constans/constants'
import { useEffect } from 'react'
import FastImage from 'react-native-fast-image'
import RowView from '../../../components/view/RowView'
import Price from '../../../components/Price'
import ItemRating from '../../../components/ItemRating'
import { setFontStyle } from '../../../utils/utils'
import { ROUTE_NAMES } from '../../../components/navigation/routes'

const CoursesScreen = (props) => {

  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [data, setData] = useState([])
  const [loadingNext, setLoadingNext] = useState(false)
  const [fetchCourses, isLoading, coursesError] = useFetching(async() => {
    const response = await CourseService.fetchCourses()
    setData(response.data?.data)
    setLastPage(response.data?.last_page)
  })
  

  useEffect(() => {
    if(page === 1) {
      fetchCourses()
    } else {
      fetchNextPage()
    }
  }, [page])

  const fetchNextPage = async() => {
    const response = await CourseService.fetchCourses("", page)
    setData(data.concat(response.data?.data))
    setLoadingNext(false)
  }

  const onEndReached = () => {
    if(page < lastPage && !loadingNext) {
      setLoadingNext(true)
      setPage(prev => prev + 1)
    }
  }

  const renderCourse = ({ item, index }) => {
    return(
      <CourseCard item={item} index={index} navigation={props?.navigation}/>
    )
  }

  const renderFooter = () => (
    <View
      style={styles.footer}
    >
      {
        loadingNext
        ?
        <ActivityIndicator color={APP_COLORS.primary}/>
        :
        null
      }
    </View>
  )

  return (
    <UniversalView>
      <SearchButton navigation={props.navigation} type={"course"}/>
      {
        isLoading
        ?
        <ActivityIndicator color={APP_COLORS.primary} style={{ marginTop: 120}}/>
        :
        <FlatList
          data={data}
          renderItem={renderCourse}
          ListFooterComponent={renderFooter}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          onEndReached={onEndReached}
          refreshing={isLoading}
          onRefresh={() => {
            if(page === 1) {
              fetchCourses()
            }
            setPage(1)
          }}
        />
      }
    </UniversalView>
  )
}

const CourseCard = ({item, index, navigation}) => {
  return(
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate(ROUTE_NAMES.courseDetail, { courseID: item?.id })}
    >
      <FastImage
        source={{ uri: item?.poster }}
        style={styles.poster}
      />
      <RowView
        style={styles.row1}
      >
        <Text style={styles.category}>{item?.category_name}</Text>
        <Price
          price={item?.price}
          oldPrice={item?.old_price}
          priceStyle={styles.price}
          oldPriceStyle={styles.price}
        />
      </RowView>
      <Text style={styles.title} numberOfLines={2}>{item?.title}</Text>
      <RowView
        style={styles.row2}
      >
        <Text>{item?.name}</Text>
        <ItemRating
          rating={item?.rating}
          reviewCount={item?.reviews_count}
          starSize={16}
        />
      </RowView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16
  },
  courseCard: {
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 22,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowColor: "#000",
    shadowRadius: 20,
    shadowOpacity: 0.09,
    elevation:1
  },
  row1: {
    justifyContent: "space-between",
    padding: 10,
    paddingBottom: 0
  },
  row2: {
    paddingHorizontal: 10,
    paddingBottom: 20
  },
  title: {
    margin: 10,
    ...setFontStyle(18, "700")
  },
  category: {
    textTransform: "uppercase",
    ...setFontStyle(14, "700", APP_COLORS.placeholder)
  },
  poster: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  price: {
    fontSize: 14
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: "center",
    alignItems: 'center'
  }
})

export default CoursesScreen