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
    const [initialStart, setInitialStart] = useState(true)

    return (
        <Settings.Provider 
            value={{
                settings: settings,
                setSettings: setSettings,
                isAuth: isAuth,
                setIsAuth: setIsAuth,
                userToken: userToken,
                setUserToken: setUserToken,
                initialStart: initialStart,
                setInitialStart: setInitialStart
            }}
        >
            {children}
        </Settings.Provider>
    )
}

export { useSettings, Provider }

