import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useEffect } from 'react'
import UniversalView from './src/components/view/UniversalView'
import { Navigation } from './src/components/navigation'

const App = () => {

  useEffect(() => {
    console.log("App.js")
  }, [])

  return (
    <Navigation isAuth={false}/>
  )
}

const styles = StyleSheet.create({
  container: {

  }
})

export default App