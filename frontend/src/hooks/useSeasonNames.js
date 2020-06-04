import { useState, useEffect } from "react";
import useFetchRepeatedly from "./useFetchRepeatedly";

export default () => {
  const delay = 60000; // 1min
  const fetchedSeasons = useFetchRepeatedly(`/api/seasons`, delay, []);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const seasonNames = fetchedSeasons.map(season => season.name);
    setSeasons(seasonNames);
  }, [fetchedSeasons]);
  return seasons;
};
