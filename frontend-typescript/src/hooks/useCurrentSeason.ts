import { useEffect, useState } from 'react';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export default () => {
  const delay = 1800000; // 30min
  const fetchedCurrentSeason = useFetchRepeatedly(
    `api/seasons/current`,
    delay,
    '0',
  );
  const [currentSeason, setCurrentSeason] = useState('0');

  useEffect(() => {
    setCurrentSeason('0');
  }, [fetchedCurrentSeason]);
  return currentSeason;
};
