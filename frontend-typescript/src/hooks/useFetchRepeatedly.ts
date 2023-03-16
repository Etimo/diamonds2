import { useEffect, useState } from "react";
import { useInterval } from "./useInterval";
import axios from "axios";

export function useFetchRepeatedly(url: string, delay: number, baseResponse: any){
    const [response, setResponse] = useState(baseResponse);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
      const fetch = async () => {
        //TODO: use url instead of test data //Klara
        //const { data } = await axios.get(url);
        const { data } = {data: {data: [
            {
                id: '1',
                name: 'Chalmers Tekniska Högskola',
                abbreviation: 'chalmers',
              },
              {
                id: '2',
                name: 'Chalmers Tekniska Högskola',
                abbreviation: 'chalmers',
            }
          ]}};
        setResponse(data.data);
      };
      fetch();
    }, [url]);
  
    useInterval(() => {
      const fetch = async () => {
        if (!isFetching) {
          setIsFetching(true);
          //TODO: use url instead of test data //Klara
          //const { data } = await axios.get(url);
          const { data } = {data: {data: [
            {
                name: 'Chalmers Tekniska Högskola',
                abbreviation: 'chalmers',
                id: '1',
              },
              {
                id: '2',
                name: 'Chalmers Tekniska Högskola',
                abbreviation: 'chalmers',
            }
          ]}};
          setResponse(data.data);
          setIsFetching(false);
        }
      };
      fetch();
    }, delay);
    return response;
}