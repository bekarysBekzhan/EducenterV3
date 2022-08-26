import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import UniversalView from '../../../components/view/UniversalView'
import { useFetching } from '../../../hooks/useFetching'
import LoadingScreen from '../../../components/LoadingScreen'
import ModuleTestItem from '../../../components/test/ModuleTestItem'
import { MyCourseService } from '../../../services/API'
import { APP_COLORS, WIDTH } from '../../../constans/constants'
import { ROUTE_NAMES } from '../../../components/navigation/routes'

const MyTestsTab = (props) => {

  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [fetchTests, isFetching, fetchingError] = useFetching(async() => {
    const response = await MyCourseService.fetchMyTests()
    setData(response.data?.data)
    setLastPage(response.data?.last_page)
  })
  const [fetchNext, isFetchingNext, fetchingNextError] = useFetching(async() => {
    const response = await MyCourseService.fetchMyTests("", page)
    setData(prev => prev.concat(response.data?.data))
  })

  // fetchTest error handler
  useEffect(() => {
    if(fetchingError) {
      console.log(fetchingError)
    }
  }, [fetchingError])

  // fetchNext error handler
  useEffect(() => {
    if(fetchingNextError) {
      console.log(fetchingNextError)
    }
  })

  useEffect(() => {
    if(page === 1) {
      fetchTests()
    } else {
      fetchNext()
    }
  }, [page])


  const testItemTapped = (testID) => {
    console.log("test : " , testID)
    props.navigation.navigate(ROUTE_NAMES.myTestDetail, {id: testID})
  }

  const renderTest = ({ item, index }) => {
    return(
      <ModuleTestItem  
        id={item?.id}
        index={index}
        categoryName={item?.category?.name}
        time={item?.timer}
        title={item?.title}
        attempts={item?.attempts}
        price={item?.price}
        oldPrice={item?.old_price}
        onPress={testItemTapped}
      />
    )
  }

  const renderFooter = () => (
    <View
      style={styles.footer}
    >
      {
        isFetchingNext
        ?
        <ActivityIndicator color={APP_COLORS.primary}/>
        :
        null
      }
    </View>
  )

  const onEndReached = () => {
    if (page < lastPage && !isFetchingNext) {
      setPage(prev => prev + 1)
    }
  }

  if (isFetching) {
    return <LoadingScreen/>
  }

  return (
    <UniversalView>
      <FlatList
        data={data}
        contentContainerStyle={styles.container}
        renderItem={renderTest}
        ListFooterComponent={renderFooter}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        refreshing={isFetching}
        onRefresh={() => {
          if(page === 1) {
            fetchTests()
          }
          setPage(1)
        }}
      />
    </UniversalView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: "center",
    alignItems: 'center'
  }
})

export default MyTestsTab