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
    grid: [],
  });
  const [bots, setBots] = useState<BotGameObjectProperties[]>([]);

  useEffect(() => {
    if (!fetchedBoard.gameObjects) return;

    const grid: IGameObjectDto[][][] = [];

    for (let i = 0; i < fetchedBoard.height; i++) {
      const row: IGameObjectDto[][] = [];
      for (let j = 0; j < fetchedBoard.width; j++) {
        row.push([]);
      }
      grid.push(row);
    }

    const botObjects: BotGameObjectProperties[] = [];

    fetchedBoard.gameObjects.forEach((gameObject) => {
      const { position } = gameObject;

      if (
        position &&
        position.y >= 0 &&
        position.y < fetchedBoard.height &&
        position.x >= 0 &&
        position.x < fetchedBoard.width
      ) {
        grid[position.y][position.x].push(gameObject);

        if (['DummyBotGameObject', 'BotGameObject'].includes(gameObject.type)) {
          botObjects.push(gameObject.properties as BotGameObjectProperties);
        }
      }
    });

    const mappedBoard: GameBoard = {
      width: fetchedBoard.width,
      height: fetchedBoard.height,
      grid: grid,
    };

    setBoard(mappedBoard);
    setBots(botObjects);
  }, [fetchedBoard]);

  return { board, bots };
};

export interface GameBoard {
  width: number;
  height: number;
  grid: IGameObjectDto[][][];
}
