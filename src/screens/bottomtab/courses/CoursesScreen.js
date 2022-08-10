import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import UniversalView from '../../../components/view/UniversalView'
import SearchButton from '../../../components/button/SearchButton'

const CoursesScreen = (props) => {
  return (
    <UniversalView>
      <SearchButton {...props}/>
    </UniversalView>
  )
}

const styles = StyleSheet.create({

})

export default CoursesScreen