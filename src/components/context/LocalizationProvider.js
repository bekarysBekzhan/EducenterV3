import React, {createContext, useContext} from 'react';
import { useRef } from 'react';

const Settings = createContext({});

const useLocalization = () => {
  const value = useContext(Settings);
  return value;
};

const LocalizationProvider = ({children}) => {
  const localization = useRef();

  return (
    <Settings.Provider
      value={{
        localization,
      }}>
      {children}
    </Settings.Provider>
  );
};

export {useLocalization, LocalizationProvider};
