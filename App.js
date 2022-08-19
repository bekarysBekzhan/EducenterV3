import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from './src/components/context/Provider'
import Navigation from './src/components/navigation/MainStack'
import Toast from 'react-native-toast-message';

const App = () => {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider>
        <Navigation/>
      </Provider>
      <Toast/>
    </GestureHandlerRootView>
  )
}

export default App