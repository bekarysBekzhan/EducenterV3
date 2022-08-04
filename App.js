import React from 'react'
import { useEffect } from 'react'
import { Provider } from './src/components/context/Provider'
import { Navigation } from './src/components/navigation'

const App = () => {

  useEffect(() => {
    console.log("App.js")
  }, [])

  return (
    <Provider>
      <Navigation isAuth={false}/>
    </Provider>
  )
}

export default App