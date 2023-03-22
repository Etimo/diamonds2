import { useEffect, useState } from 'react';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export default (boardId: number, delay: number) => {
  const fetchedBoard = useFetchRepeatedly(`/api/boards/${boardId}`, delay, []);
  const [board, setBoard] = useState({
    width: 0,
    height: 0,
    rows: [],
  } as IBoard);

  useEffect(() => {
    const mappedRows: IGameObject[][] = [];
    for (let i = 0; i < fetchedBoard.height; i++) {
      mappedRows.push(Array(fetchedBoard.width).fill(null));
    }

    if (fetchedBoard.gameObjects && fetchedBoard.gameObjects.length > 0) {
      fetchedBoard.gameObjects.forEach((gameObject: any) => {
        mappedRows[gameObject.position.y][gameObject.position.x] = {
          type: gameObject.type,
        } as IGameObject;
      });
    }

    const mappedBoard = {
      width: fetchedBoard.width,
      height: fetchedBoard.height,
      rows: mappedRows,
    };
    setBoard(mappedBoard);
  }, [fetchedBoard]);

  return board;
};

interface IBoard {
  width: number;
  height: number;
  rows: IGameObject[][];
}

interface IGameObject {
  type: string;
}
