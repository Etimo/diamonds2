import axios from 'axios';
import { useEffect, useState } from 'react';

export default (url: string, baseResponse: any) => {
  const [response, setResponse] = useState(baseResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetch = async () => {
    try {
      const response = await axios.get(url);
      setResponse(response.data);
    } catch (error) {
      setResponse(undefined);
      setError(true);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetch();
    setIsLoading(false);
  }, [url]);

  return { response, error, isLoading };
};
