import { IBoardConfigDto } from '@etimo/diamonds2-types';
import { useEffect, useState } from 'react';
import useFetch from './useFetch';

export function useBoardConfig(seasonId: string): IBoardConfigDto | null {
  const delay = 60000; // 1 min

  const { response, error, isLoading } = useFetch(
    `api/seasons/rules/${seasonId}`,
    [],
  );

  const [boardConfig, setBoardConfig] = useState<IBoardConfigDto | null>(null);

  useEffect(() => {
    if (response) {
      setBoardConfig({
        id: response.id,
        seasonId: response.seasonId,
        inventorySize: response.inventorySize,
        minimumDelayBetweenMoves: response.minimumDelayBetweenMoves,
        sessionLength: response.sessionLength,
        teleporters: response.teleporters,
        // useTelporters: response.useTelporters ? 'On' : 'Off', // does not exist on response
        canTackle: response.canTackle,
        teleportRelocation: response.teleportRelocation,
        height: response.height,
        width: response.width,
      });
    }
  }, [response]);

  return boardConfig;
}
