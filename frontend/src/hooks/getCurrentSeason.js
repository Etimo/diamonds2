import { useState, useEffect } from "react";
import useFetchRepeatedly from "./useFetchRepeatedly";

export default () => {
  const delay = 1800000; // 30min
  const fetchedCurrentSeason = useFetchRepeatedly(
    `/api/seasons/current`,
    delay,
    []
  );
  const [currentSeason, setCurrentSeason] = useState([]);

  useEffect(() => {
    setCurrentSeason(fetchedCurrentSeason);
  }, [fetchedCurrentSeason]);
  return currentSeason;
};
