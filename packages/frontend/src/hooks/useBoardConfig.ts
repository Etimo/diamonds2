import type { IBoardConfigDto } from "@etimo/diamonds2-types";
import { useEffect, useState } from "react";
import useFetch from "./useFetch.ts";

export function useBoardConfig(seasonId: string): IBoardConfigDto | null {
  const { response } = useFetch(`api/seasons/${seasonId}/rules/`, []);

  const [boardConfig, setBoardConfig] = useState<IBoardConfigDto | null>(null);

  useEffect(() => {
    if (response) {
      setBoardConfig(response);
    }
  }, [response]);

  return boardConfig;
}
