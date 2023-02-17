import { useState, useEffect } from 'react';
import axios from 'axios';
import { useInterval } from './useInterval';

export const useFetchRepeatedly = <T>(
  url: string,
  delay: number,
  baseResponse: T[],
) => {
  const [response, setResponse] = useState(baseResponse);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(url);
      setResponse(data.data);
    };
    fetch();
  }, [url]);

  useInterval(() => {
    const fetch = async () => {
      if (!isFetching) {
        setIsFetching(true);

        const { data } = await axios.get(url);

        setResponse(data.data);
        setIsFetching(false);
      }
    };
    fetch();
  }, delay);

  return response;
};
