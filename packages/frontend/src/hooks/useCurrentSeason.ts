import { ISeasonDto } from '@etimo/diamonds2-types';
import { useEffect, useState } from 'react';
import useFetch from './useFetch';

// export interface ICurrentSeason {
//   id: string;
//   name: string;
//   startDate: Date;
//   endDate: Date;
// }

export const useCurrentSeason = (): ISeasonDto => {
  const {
    response: fetchedCurrentSeason,
    error,
    isLoading,
  } = useFetch(`api/seasons/current`, '0');
  const [currentSeason, setCurrentSeason] = useState<ISeasonDto>({
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
