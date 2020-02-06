import { useState, useEffect } from "react";
import useInterval from "./useInterval";
import axios from "axios";

export default (url, delay, baseResponse) => {
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
};
