import { useEffect, useState } from 'react';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export function useBoard(boardId: number, delay: number) {
  const fetchedBoard = useFetchRepeatedly(`/api/boards/${boardId}`, delay, []);
  const [board, setBoard] = useState({
    width: 0,
    height: 0,
    rows: [],
  } as IBoard);

  const [bots, setBots] = useState([] as IBot[]);

  useEffect(() => {
    const mappedRows: IGameObject[][] = [];

    for (let i = 0; i < fetchedBoard.height; i++) {
      mappedRows.push(Array(fetchedBoard.width).fill(null));
    }

    let bots: IBot[] = [];

    if (fetchedBoard.gameObjects && fetchedBoard.gameObjects.length > 0) {
      fetchedBoard.gameObjects.forEach((gameObject: any) => {
        // make object for some types of game objects
        let object = undefined;
        if (gameObject.type === 'DiamondGameObject') {
          object = {
            points: gameObject.properties.points,
          } as IDiamond;
        } else if (
          gameObject.type === 'DummyBotGameObject' ||
          gameObject.type === 'BotGameObject'
        ) {
          object = {
            name: gameObject.properties.name,
            diamonds: gameObject.properties.diamonds,
            score: gameObject.properties.score,
            time: Math.round(gameObject.properties.millisecondsLeft / 1000),
          } as IBot;
          bots.push(object);
        } else if (gameObject.type === 'BaseGameObject') {
          object = {
            name: '',
          } as IBase;
        }

        let type = gameObject.type;

        // check if there is already a game object on this position
        if (mappedRows[gameObject.position.y][gameObject.position.x]) {
          // if there is already a game object, add the new game object type to the existing type
          type =
            mappedRows[gameObject.position.y][gameObject.position.x].type +
            type;
        }

        mappedRows[gameObject.position.y][gameObject.position.x] = {
          type: type,
          object,
        } as IGameObject;
      });
    }

    const mappedBoard = {
      width: fetchedBoard.width,
      height: fetchedBoard.height,
      rows: mappedRows,
    };
    setBoard(mappedBoard);
    setBots(bots);
  }, [fetchedBoard]);
  return { board, bots };
}

export interface IBoard {
  width: number;
  height: number;
  rows: IGameObject[][];
}

export interface IGameObject {
  type: string;
  object: undefined | IBot | IDiamond;
}

export type GameObjectType =
  | 'Teleporter'
  | 'Wall'
  | 'DiamondButtonGameObject'
  | 'DiamondGameObject'
  | 'DiamondGameObjectDiamondGameObject'
  | 'BotGameObject'
  | 'DummyBotGameObject'
  | 'BaseGameObject'
  | 'BotGameObjectBaseGameObject'
  | 'BaseGameObjectBotGameObject'
  | 'DiamondGameObjectBotGameObject'
  | 'BotGameObjectDiamondGameObject'
  | 'TeleportGameObject';

export interface IDiamond {
  points: number;
}

export interface IBot {
  name: string;
  diamonds: number;
  score: number;
  time: number;
}

export interface IBase {
  name: string;
}
