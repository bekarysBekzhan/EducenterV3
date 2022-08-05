import React, { useState } from 'react'
import { useEffect } from 'react'
import { Provider } from './src/components/context/Provider'
import { useFetching } from './src/components/hooks/useFetching'
import { Navigation } from './src/components/navigation'
import UniversalView from './src/components/view/UniversalView'
import { getString } from "./src/storage/AsyncStorage"

const App = () => {
  
  return (
    <Provider>
      <Navigation/>
    </Provider>
  )
}

export default App