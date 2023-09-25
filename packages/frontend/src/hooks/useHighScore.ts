import { IHighscoreDto } from '@etimo/diamonds2-types';
import { useEffect } from 'react';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export function useHighScore(seasonId: string): IHighscoreDto[] {
  const fetchedHighScore = useFetchRepeatedly(
    `api/highscores/${seasonId}`,
    5000,
    [],
  );

  useEffect(() => {}, [fetchedHighScore]);
  if (!fetchedHighScore) {
    return [];
  }
  return fetchedHighScore;
}
