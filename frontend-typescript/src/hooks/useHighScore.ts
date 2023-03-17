import { useEffect, useState } from "react";

//TODO: use fetch hook instead of test data //Klara
function getHighScore(seasonId: string): IHighScore[] {
    if (seasonId === '0'){
        const highScore: IHighScore[] = [
            { name: 'Test', team: 'Test', score: 5 },
            { name: 'Test 2', team: 'Test', score: 4 },
            { name: 'Test 3', team: 'Test', score: 1 },
          ];
        return highScore;
    }
    else{
        const highScore: IHighScore[] = [
            { name: 'Etimo 1', team: 'Etimo', score: 5 },
            { name: 'Etimo 2', team: 'Etimo', score: 1 },
          ];
        return highScore;
    }

}

export function useHighScore(seasonId: string): IHighScore[] {

    const [highScore, setHighScore] = useState<IHighScore[]>(() =>getHighScore(seasonId));

    useEffect(() => {
        setHighScore(getHighScore(seasonId));
    }, [seasonId]);
    return highScore;
}

export interface IHighScore {
    name: string;
    team: string;
    score: number;
  };