import { useState, useEffect } from "react";
import axios from "axios";

export default (url, baseResponse) => {
  const [response, setResponse] = useState(baseResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetch = async () => {
    try {
      const response = await axios.get(url);
      setResponse(response.data.data);
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
