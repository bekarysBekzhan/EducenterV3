import React from 'react'
import UniversalView from '../components/view/UniversalView'
import { FlatList } from 'react-native-gesture-handler'
import { useState } from 'react'
import SelectOption from '../components/SelectOption'

const SelectCategoryScreen = ({ navigation, route }) => {

  const [currentKey, setCurrentKey] = useState(route.params.category)

  const selectKeyPressed = (value) => {
    if(currentKey !== value) {
      setCurrentKey(value)
      route.params.setCategory(value)
      route.params.setSelectedCategory(value.name)
    }
  }

  const renderItem = ({ item, index }) => {
    return(
      <SelectOption
        value={item}
        _key={item?.id}
        label={item?.name}
        currentKey={currentKey}
        selectKeyPressed={selectKeyPressed}
      />
    )
  }

  return (
    <UniversalView>
      <FlatList
        data={route.params.data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
    </UniversalView>
  )
}

export default SelectCategoryScreen