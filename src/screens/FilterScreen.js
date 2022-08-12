import { BottomSheetView } from '@gorhom/bottom-sheet'
import React from 'react'
import { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import SimpleButton from '../components/button/SimpleButton'
import { ROUTE_NAMES } from '../components/navigation/routes'
import SelectOption from '../components/SelectOption'
import NavButtonRow from '../components/view/NavButtonRow'
import SectionView from '../components/view/SectionView'
import { strings } from '../localization'

const FilterScreen = ({ navigation, route }) => {

  console.log("FilterScreen : " , route.params)

  const renderFilter = ({ item, index }) => {
    return(
      <NavButtonRow
        title={item.title}
        onPress={() => navigation.navigate(ROUTE_NAMES.selectCategory, { data: item.data })}
        style={styles.navButton}
      />
    )
  }
  
  return (
    <BottomSheetView
      style={styles.container}
    >
      <FlatList
        data={route.params.filterConfigs.filters}
        renderItem={renderFilter}
        ListFooterComponent={<Footer 
          options={route.params.filterConfigs.sort.options} 
          sort={route.params.sort}
          setSort={route.params.setSort}
          setCategory={route.params.setCategory}
        />}
        keyExtractor={(_, index) => index.toString()}
      />
    </BottomSheetView>
  )
}

const Footer = ({ options, sort, setSort, setCategory }) => {

  const [currentKey, setCurrentKey] = useState(sort)

  const selectKeyPressed = (key) => {
    setCurrentKey(key)
    setSort(key)
  }

  const clearFilterTapped = () => {
    setCurrentKey(null)
    setSort(null)
    setCategory(null)
  }

  return(
    <View>
      <SectionView label={strings.Сортировка}/>
      {
        options.map((o, index) => (
          <SelectOption
            value={o}
            key={index}
            currentKey={currentKey}
            selectKeyPressed={selectKeyPressed}
          />
        ))
      }
      <SimpleButton
        text={strings.Отменить}
        onPress={clearFilterTapped}
        style={styles.button}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  button: {
    margin: 16,
    marginTop: 30
  },
  navButton: {
    marginVertical: 16,
    marginRight: 16
  }
})

export default FilterScreen