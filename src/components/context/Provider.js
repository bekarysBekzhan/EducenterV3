import React, {createContext, useContext} from 'react';
import {useState} from 'react';
import {
  APP_COLORS,
  N_DESIGN,
  N_STATUS,
  N_ICON,
  N_MY_COURSE,
  N_COURSE,
} from '../../constans/constants';

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
  const [nCourse, setNCourse] = useState(N_COURSE);
  const [nMyCourse, setNMyCourse] = useState(N_MY_COURSE);
  const [nIcon, setNIcon] = useState(N_ICON);

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

        nCourse,
        setNCourse,

        nMyCourse,
        setNMyCourse,

        nIcon,
        setNIcon,
      }}>
      {children}
    </Settings.Provider>
  );
};

export {useSettings, Provider};
