import { ISeasonDto } from '@etimo/diamonds2-types';
import { useEffect, useState } from 'react';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export default () => {
  const delay = 60000; // 1min
  const fetchedSeasons = useFetchRepeatedly(`api/seasons`, delay, []);
  const [seasons, setSeasons] = useState<ISeasonDto[]>([]);

  useEffect(() => {
    setSeasons(fetchedSeasons);
  }, [fetchedSeasons]);
  return seasons;
};
