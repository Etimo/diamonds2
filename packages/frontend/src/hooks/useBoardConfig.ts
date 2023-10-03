import { IBoardConfigDto } from '@etimo/diamonds2-types';
import { useEffect, useState } from 'react';
import useFetch from './useFetch';

export function useBoardConfig(seasonId: string): IBoardConfigDto | null {
  const delay = 60000; // 1 min

  const { response, error, isLoading } = useFetch(
    `api/seasons/${seasonId}/rules/`,
    [],
  );

  const [boardConfig, setBoardConfig] = useState<IBoardConfigDto | null>(null);

  useEffect(() => {
    if (response) {
      setBoardConfig(response);
    }
  }, [response]);

  return boardConfig;
}
