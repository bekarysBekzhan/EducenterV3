import React, {createContext, useContext} from 'react';
import {useState} from 'react';
import {APP_COLORS, N_DESIGN, N_STATUS} from '../../constans/constants';

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
  const [nstatus, setNstatus] = useState(N_STATUS);
  const [color, setColor] = useState(APP_COLORS.primary);
  const [language, setLanguage] = useState('ru');
  const [ndesign, setNdesign] = useState(N_DESIGN);

  return (
    <Settings.Provider
      value={{
        settings,
        setSettings,

        isAuth,
        setIsAuth,

        initialStart,
        setInitialStart,

        isRead,
        setIsRead,

        nstatus,
        setNstatus,

        color,
        setColor,

        language,
        setLanguage,

        ndesign,
        setNdesign
      }}>
      {children}
    </Settings.Provider>
  );
};

export {useSettings, Provider};
