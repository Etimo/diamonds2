import { useState, useEffect } from "react";

//TODO: use fetch hook instead of test data //Klara
function getBoardConfig(seasonId: string): IRules {
    if (seasonId === '0'){
        const seasonRules: IRules = { minimumDelayBetweenMoves: '100', inventorySize: '5', useTelporters: 'On', teleporters: '3', sessionLength: '2', canTackle: 'On', teleportersRelocation: '50', gridSize: '15 X 15' };
        return seasonRules;
    }
    else{
        const seasonRules: IRules = { minimumDelayBetweenMoves: '100', inventorySize: '5', useTelporters: 'On', teleporters: '3', sessionLength: '2', canTackle: 'On', teleportersRelocation: '50', gridSize: '10 X 10' };
        return seasonRules;
    }

}

export function useBoardConfig(seasonId: string): IRules {

    const [boardConfig, setBoardConfig] = useState<IRules>(() => getBoardConfig(seasonId));

    useEffect(() => {
        setBoardConfig(getBoardConfig(seasonId));
    }, [seasonId]);
    return boardConfig;
}


export interface IRules{
    minimumDelayBetweenMoves: string;
    inventorySize: string;
    sessionLength: string;
    canTackle: string;
    teleporters: string;
    teleportersRelocation: string;
    useTelporters: string;
    gridSize: string;
  }