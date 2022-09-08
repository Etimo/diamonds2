import axios from "axios";
import { useState } from "react";

export default url => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async data => {
    setIsLoading(true);
    return axios
      .post(url, data)
      .then(() => {
        setIsLoading(false);
      })
      .catch(error => {
        const { data } = error.response.data;
        setError({ error: data.error, message: data.message });
        setIsLoading(false);
      });
  };

  return { post, error, isLoading };
};
