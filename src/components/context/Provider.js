import React, {createContext, useContext} from 'react';
import {useState} from 'react';
import { N_STATUS } from '../../constans/constants';

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

  return (
    <Settings.Provider
      value={{settings, setSettings, isAuth, setIsAuth, initialStart, setInitialStart, isRead, setIsRead, nstatus, setNstatus}}>
      {children}
    </Settings.Provider>
  );
};

export {useSettings, Provider};
