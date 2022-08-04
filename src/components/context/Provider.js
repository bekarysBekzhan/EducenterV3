import { View, Text } from 'react-native'
import React, { createContext, useContext } from 'react'
import { useState } from 'react'

const Settings = createContext({})

const useSettings = () => {
    const value = useContext(Settings)
    return value
}

const Provider = ({children}) => {

    const [settings, setSettings] = useState(null)

  return (
    <Settings.Provider 
        value={{
            settings: settings,
            setSettings: setSettings
        }}
    >
        {children}
    </Settings.Provider>
  )
}

export { useSettings, Provider }

