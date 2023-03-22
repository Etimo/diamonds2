import { useEffect, useState } from 'react';

//TODO: use fetch hook instead of test data //Klara
function getPlayers(boardId: number): IPlayer[] {
  if (boardId === 1) {
    const highScore: IPlayer[] = [
      { name: 'Etimo 1', diamonds: 3, score: 5, time: 32 },
      { name: 'Etimo 2', diamonds: 0, score: 1, time: 20 },
    ];
    return highScore;
  } else {
    const highScore: IPlayer[] = [
      { name: 'Test 1', diamonds: 3, score: 5, time: 32 },
      { name: 'Test 2', diamonds: 0, score: 1, time: 20 },
      { name: 'Test 3', diamonds: 14, score: 14, time: 19 },
    ];
    return highScore;
  }
}

export function usePlayer(boardId: number): IPlayer[] {
  const [highScore, setBoardId] = useState<IPlayer[]>();

  useEffect(() => {
    setBoardId(getPlayers(boardId));
  }, [boardId]);

  if (!highScore) {
    return [];
  }
  return highScore;
}

export interface IPlayer {
  name: string;
  diamonds: number;
  score: number;
  time: number;
}
