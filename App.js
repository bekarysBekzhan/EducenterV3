import React from 'react'
import { Provider } from './src/components/context/Provider'
import Navigation from './src/components/navigation'

const App = () => {

  return (
    <Provider>
      <Navigation/>
    </Provider>
  )
}

export default App