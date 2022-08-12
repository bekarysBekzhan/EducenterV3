import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from './src/components/context/Provider'
import Navigation from './src/components/navigation/MainStack'

const App = () => {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider>
        <Navigation/>
      </Provider>
    </GestureHandlerRootView>
  )
}

export default App