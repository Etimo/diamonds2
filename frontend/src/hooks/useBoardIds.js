import { useState, useEffect } from "react";
import useFetchRepeatedly from "./useFetchRepeatedly";

export default () => {
  const delay = 10000; // 10s
  const boards = useFetchRepeatedly(`/api/boards`, delay, []);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const boardIds = boards.map((board) => board.id);
    setIds(boardIds);
  }, [boards]);

  return ids;
};
