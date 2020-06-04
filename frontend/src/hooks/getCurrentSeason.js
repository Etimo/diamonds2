import { useState, useEffect } from "react";
import useFetchRepeatedly from "./useFetchRepeatedly";

export default () => {
  const delay = 1800000; // 30min
  const fetchedCurrentSeason = useFetchRepeatedly(
    `/api/seasons/currentSeason`,
    delay,
    []
  );
  const [currentSeason, setCurrentSeason] = useState([]);

  useEffect(() => {
    const season = fetchedCurrentSeason.name;
    setCurrentSeason(season);
  }, [fetchedCurrentSeason]);
  return currentSeason;
};
