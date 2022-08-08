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
    const [isAuth, setIsAuth] = useState(null)
    const [userToken, setUserToken] = useState(null)

    return (
        <Settings.Provider 
            value={{
                settings: settings,
                setSettings: setSettings,
                isAuth: isAuth,
                setIsAuth: setIsAuth,
                userToken: userToken,
                setUserToken: setUserToken
            }}
        >
            {children}
        </Settings.Provider>
    )
}

export { useSettings, Provider }

