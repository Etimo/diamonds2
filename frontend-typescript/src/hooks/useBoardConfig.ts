import { useEffect, useState } from 'react';
import { useFetch } from './useFetch';

export const useBoardConfig = (seasonId: string) => {
  const [rules, setRules] = useState(undefined);
  const { response } = useFetch<any>(
    `/api/seasons/rules/${seasonId}`,
    undefined,
  );

  useEffect(() => {
    if (response) {
      setRules(response);
    } else {
      setRules(undefined);
    }
  }, [response]);
  return rules;
};
