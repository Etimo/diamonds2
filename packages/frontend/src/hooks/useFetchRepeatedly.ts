import axios from 'axios';
import { useEffect, useState } from 'react';
import { useInterval } from './useInterval';

export function useFetchRepeatedly(
  url: string,
  delay: number,
  baseResponse: any,
) {
  const [response, setResponse] = useState(baseResponse);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(url);
      setResponse(data);
    };
    fetch();
  }, [url]);

  useInterval(() => {
    const fetch = async () => {
      if (!isFetching) {
        setIsFetching(true);
        const { data } = await axios.get(url);
        setResponse(data);
        setIsFetching(false);
      }
    };
    fetch();
  }, delay);
  return response;
}
