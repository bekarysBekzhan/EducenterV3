import {useEffect, useState} from 'react';

const useDebounce = (value, timeout) => {
  const [debaunceValue, setDebaunceValue] = useState(timeout);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebaunceValue(value);
    }, timeout);

    return () => {
      clearTimeout(handler);
    };
  }, []);

  return debaunceValue;
};

export default useDebounce;
