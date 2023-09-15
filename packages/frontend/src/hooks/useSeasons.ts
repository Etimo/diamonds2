import { useEffect, useState } from 'react';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export default () => {
  const delay = 60000; // 1min
  const fetchedSeasons = useFetchRepeatedly(`api/seasons`, delay, []);
  const [seasons, setSeasons] = useState([] as ISeason[]);

  useEffect(() => {
    setSeasons(fetchedSeasons);
  }, [fetchedSeasons]);
  return seasons;
};

interface ISeason {
  id: string;
  name: string;
}
