import { useEffect, useState } from 'react';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export function useHighScore(seasonId: string): IHighScore[] {
  const [mappedHighScores, setMappedHighScores] = useState<IHighScore[]>();
  const higheScore = useFetchRepeatedly(`api/highscores/${seasonId}`, 5000, []);

  useEffect(() => {
    if (higheScore) {
      const mappedHighScores = higheScore.map((highScore: HighScore) => ({
        name: highScore.botName,
        team: '',
        score: highScore.score,
      }));
      setMappedHighScores(mappedHighScores);
    } else {
      setMappedHighScores([]);
    }
  }, [higheScore]);
  if (!mappedHighScores) {
    return [];
  }
  return mappedHighScores;
}

type HighScore = {
  botName: string;
  score: number;
};

export interface IHighScore {
  name: string;
  team: string;
  score: number;
}
