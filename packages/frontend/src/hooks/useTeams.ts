import type { ITeamDto } from "@etimo/diamonds2-types";
import { useEffect, useState } from "react";
import { useFetchRepeatedly } from "./useFetchRepeatedly.ts";

export default () => {
  const delay = 60000; // 1min
  const fetchedTeams = useFetchRepeatedly(`api/teams`, delay, []);
  const [teams, setTeams] = useState<ITeamDto[]>([]);

  useEffect(() => {
    setTeams(fetchedTeams);
  }, [fetchedTeams]);
  return teams;
};
