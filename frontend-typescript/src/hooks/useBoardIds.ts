import { useEffect, useState } from 'react';
import { baseUrl } from '../constants';
import { Board } from '../models';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export const useBoardIds = () => {
  const delay = 10000; // 10s
  const boards = useFetchRepeatedly<Pick<Board, 'id'>>(
    baseUrl + `/api/boards`,
    delay,
    [],
  );
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const boardIds = boards.map(board => board.id);
    setIds(boardIds);
  }, [boards]);

  return ids;
};
