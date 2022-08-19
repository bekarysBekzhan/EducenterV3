import {useState} from 'react';

export const useFetching = callback => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetching = async (...props) => {
    try {
      setIsLoading(true);
      setError('');
      await callback(...props);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return [fetching, isLoading, error];
};
