import React, {createContext, useContext} from 'react';
import {useState} from 'react';

const Settings = createContext({});

const useSettings = () => {
  const value = useContext(Settings);
  return value;
};

const Provider = ({children}) => {
  const [settings, setSettings] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [initialStart, setInitialStart] = useState(true);
  const [isRead, setIsRead] = useState(true);

  return (
    <Settings.Provider
      value={{settings, setSettings, isAuth, setIsAuth, initialStart, setInitialStart, isRead, setIsRead}}>
      {children}
    </Settings.Provider>
  );
};

export {useSettings, Provider};
