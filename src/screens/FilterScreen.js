import { BottomSheetView } from '@gorhom/bottom-sheet'
import React from 'react'
import { StyleSheet } from 'react-native'
import UniversalView from '../components/view/UniversalView'

const FilterScreen = ({ navigatiom, route }) => {


  console.log("FilterScreen")
  
  return (
    <BottomSheetView
      style={styles.container}
    >

    </BottomSheetView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default FilterScreen