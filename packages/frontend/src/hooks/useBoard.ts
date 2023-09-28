import {
  BotGameObjectProperties,
  IBoardDto,
  IGameObjectDto,
} from '@etimo/diamonds2-types';
import { useEffect, useState } from 'react';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export const useBoard = (boardId: number, delay: number) => {
  const fetchedBoard: IBoardDto = useFetchRepeatedly(
    `/api/boards/${boardId}`,
    delay,
    [],
  );
  const [board, setBoard] = useState<GameBoard>({
    width: 0,
    height: 0,
    rows: [],
  });
  const [bots, setBots] = useState<BotGameObjectProperties[]>([]);

  useEffect(() => {
    if (!fetchedBoard.gameObjects) return;

    // Create an empty grid
    const mappedRows: IGameObjectDto[][] = [];
    const botObjects: BotGameObjectProperties[] = [];

    for (let i = 0; i < fetchedBoard.height; i++) {
      mappedRows.push(Array(fetchedBoard.width).fill(null));
    }

    fetchedBoard.gameObjects.forEach((gameObject) => {
      const { position } = gameObject;

      // Only update the grid if the position is valid
      if (
        position &&
        position.y >= 0 &&
        position.y < fetchedBoard.height &&
        position.x >= 0 &&
        position.x < fetchedBoard.width
      ) {
        mappedRows[position.y][position.x] = gameObject;

        // Check if it's a bot object and add it to the botObjects array
        if (
          gameObject.type === 'DummyBotGameObject' ||
          gameObject.type === 'BotGameObject'
        ) {
          botObjects.push(gameObject.properties);
        }
      }
    });

    const mappedBoard: GameBoard = {
      width: fetchedBoard.width,
      height: fetchedBoard.height,
      rows: mappedRows,
    };

    setBoard(mappedBoard);
    setBots(botObjects);
  }, [fetchedBoard]);

  return { board, bots };
};

export interface GameBoard {
  width: number;
  height: number;
  rows: IGameObjectDto[][];
}
