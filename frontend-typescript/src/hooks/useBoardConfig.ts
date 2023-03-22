import { useEffect, useState } from 'react';
import useFetch from './useFetch';

export function useBoardConfig(seasonId: string): IRules {
  const delay = 60000; // 1min

  const { response, error, isLoading } = useFetch(
    `api/seasons/rules/${seasonId}`,
    [],
  );

  const [boardConfig, setBoardConfig] = useState<IRules>({
    inventorySize: response.inventorySize,
    minimumDelayBetweenMoves: response.minimumDelayBetweenMoves,
    sessionLength: response.sessionLength,
    canTackle: response.canTackle ? 'On' : 'Off',
    useTelporters: response.useTelporters ? 'On' : 'Off',
    teleportersRelocation: `${response.teleportRelocation} s`,
    teleporters: response.teleporters,
    gridSize: `${response.width} X ${response.height}`,
  });

  useEffect(() => {
    setBoardConfig({
      inventorySize: response.inventorySize,
      minimumDelayBetweenMoves: response.minimumDelayBetweenMoves,
      sessionLength: response.sessionLength,
      teleporters: response.teleporters,
      useTelporters: response.useTelporters ? 'On' : 'Off',
      canTackle: response.canTackle ? 'On' : 'Off',
      teleportersRelocation: `${response.teleportRelocation} s`,
      gridSize: `${response.width} X ${response.height}`,
    } as IRules);
  }, [response]);

  return boardConfig;
}

export interface IRules {
  minimumDelayBetweenMoves: number;
  inventorySize: number;
  sessionLength: number;
  canTackle: string;
  teleporters: number;
  teleportersRelocation: string;
  useTelporters: string;
  gridSize: string;
}
