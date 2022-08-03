import React from 'react'
import { useEffect } from 'react'
import { Navigation } from './src/components/navigation'

const App = () => {

  useEffect(() => {
    console.log("App.js")
  }, [])

  return (
    <Navigation isAuth={false}/>
  )
}

export default App