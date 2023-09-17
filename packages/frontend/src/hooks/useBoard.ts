import { useEffect, useState } from 'react';
import { useFetchRepeatedly } from './useFetchRepeatedly';

export const useBoard = (boardId: number, delay: number) => {
  const fetchedBoard: BoardResponse = useFetchRepeatedly(
    `/api/boards/${boardId}`,
    delay,
    [],
  );
  const [bots, setBots] = useState<IBot[]>([]);
  const [board, setBoard] = useState<GameBoard>({
    width: 0,
    height: 0,
    rows: [],
  });

  useEffect(() => {
    const mappedRows: GameObject[][] = [];
    const bots: IBot[] = [];

    for (let i = 0; i < fetchedBoard.height; i++) {
      mappedRows.push(Array(fetchedBoard.width).fill(undefined));
    }

    if (fetchedBoard.gameObjects && fetchedBoard.gameObjects.length > 0) {
      fetchedBoard.gameObjects.forEach((gameObject) => {
        let properties: Partial<Properties> | null = null;

        if (gameObject.properties !== null) {
          if (gameObject.type === 'DiamondGameObject') {
            properties = {
              points: gameObject?.properties.points,
            };
          } else if (gameObject.type === 'BaseGameObject') {
            properties = {
              name: '',
            };
          } else if (
            gameObject.type === 'DummyBotGameObject' ||
            gameObject.type === 'BotGameObject'
          ) {
            properties = {
              name: gameObject.properties.name,
              diamonds: gameObject.properties.diamonds,
              score: gameObject.properties.score,
              millisecondsLeft:
                gameObject.properties.millisecondsLeft &&
                Math.round(gameObject.properties.millisecondsLeft / 1000),
            };
            bots.push(properties as IBot);
          }
        }

        let type: GameObjectType = gameObject.type;

        if (mappedRows[gameObject.position.y][gameObject.position.x]) {
          type = (mappedRows[gameObject.position.y][gameObject.position.x]
            .type + type) as GameObjectType;
        }

        mappedRows[gameObject.position.y][gameObject.position.x] = {
          type: type,
          properties,
          position: gameObject.position,
        };
      });
    }

    const mappedBoard: GameBoard = {
      width: fetchedBoard.width,
      height: fetchedBoard.height,
      rows: mappedRows,
    };

    setBoard(mappedBoard);
    setBots(bots);
  }, [fetchedBoard]);

  return { board, bots };
};

export interface GameBoard {
  width: number;
  height: number;
  rows: GameObject[][];
}

export type GameObject = {
  type: GameObjectType;
  position: {
    x: number;
    y: number;
  };
  properties: Partial<Properties> | null;
};

type Properties = {
  diamonds: number;
  score: number;
  name: string;
  inventorySize: number;
  canTackle: boolean;
  millisecondsLeft: number;
  timeJoined: Date;
  points: number;
  base: {
    x: number;
    y: number;
  };
} | null;

type BoardResponse = {
  id: number;
  width: number;
  height: number;
  minimumDelayBetweenMoves: number;
  gameObjects: GameObject[];
  // this response includes features according to swagger at 20230915, but frontend does not use it
  /* features: x */
};

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
  | 'DummyBotGameObjectBaseGameObject'
  | 'BaseGameObjectBotGameObject'
  | 'BaseGameObjectDummyBotGameObject'
  | 'DiamondGameObjectBotGameObject'
  | 'DiamondGameObjectDummyBotGameObject'
  | 'BotGameObjectDiamondGameObject'
  | 'DummyBotGameObjectDiamondGameObject'
  | 'TeleportGameObject'
  | 'TeleportGameObjectBotGameObject'
  | 'TeleportGameObjectDummyBotGameObject'
  | 'DummyBotGameObjectTeleportGameObject'
  | 'BotGameObjectTeleportGameObject';

export interface IDiamond {
  points: number;
}

export interface IBot {
  name: string;
  diamonds: number;
  score: number;
  millisecondsLeft: number;
}

export interface IBase {
  name: string;
}
