import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import UniversalView from '../../../components/view/UniversalView'
import { useFetching } from '../../../hooks/useFetching'
import LoadingScreen from '../../../components/LoadingScreen'
import SearchButton from '../../../components/button/SearchButton'
import ModuleTestItem from '../../../components/test/ModuleTestItem'
import { TestService } from '../../../services/API'

const TestsScreen = (props) => {

  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [fetchTests, isFetching, fetchingError] = useFetching(async() => {
    const response = await TestService.fetchTests()
    setData(response.data)
    setLastPage(response.data?.last_page)
  })

  // fetchTest error handler
  useEffect(() => {
    if(fetchingError) {
      console.log(fetchingError)
    }
  }, [fetchingError])

  useEffect(() => {
    fetchTests()
  }, [])

  const testItemTapped = (testID) => {
    console.log("test : " , testID)
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

  const onEndReached = () => {

  }

  if (isFetching) {
    return <LoadingScreen/>
  }

  return (
    <UniversalView>
      <SearchButton {...props}/>
      <FlatList
        data={data?.data}
        renderItem={renderTest}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        refreshing={isFetching}
      />
    </UniversalView>
  )
}

const styles = StyleSheet.create({

})

export default TestsScreen