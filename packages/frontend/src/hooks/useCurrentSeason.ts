import { useEffect, useState } from 'react';
import useFetch from './useFetch';

export interface ICurrentSeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export const useCurrentSeason = (): ICurrentSeason => {
  const {
    response: fetchedCurrentSeason,
    error,
    isLoading,
  } = useFetch(`api/seasons/current`, '0');
  const [currentSeason, setCurrentSeason] = useState<ICurrentSeason>({
    id: '0',
    name: '',
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    setCurrentSeason(fetchedCurrentSeason);
  }, [fetchedCurrentSeason]);

  return currentSeason;
};
