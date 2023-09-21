import { IHighscoreDto } from '@etimo/diamonds2-types';
import { useEffect } from 'react';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export function useHighScore(seasonId: string): IHighscoreDto[] {
  // const [mappedHighScores, setMappedHighScores] = useState<IHighscoreDto[]>();
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

// type HighScore = {
//   botName: string;
//   score: number;
// };
