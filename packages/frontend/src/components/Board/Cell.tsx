import { FC, memo } from 'react';
import { GameObject, GameObjectType, IDiamond } from '../../hooks/useBoard';
import {
  base,
  botBase,
  botDiamond,
  diamond,
  diamondRed,
  redButton,
  robot,
  teleporter,
  wall,
} from '../images';

type CellProps = {
  gameObject: GameObject;
  id: string;
};

type GameObjectMap = {
  [key in GameObjectType]: string;
};

const getGameCharacter = (gameObject: GameObject) => {
  const goImgMap: GameObjectMap = {
    Teleporter: teleporter,
    Wall: wall,
    DiamondButtonGameObject: redButton,
    DiamondGameObject: diamond,
    DiamondGameObjectDiamondGameObject: diamond,
    BotGameObject: robot,
    DummyBotGameObject: robot,
    BaseGameObject: base,
    BotGameObjectBaseGameObject: botBase,
    DummyBotGameObjectBaseGameObject: botBase,
    BaseGameObjectBotGameObject: botBase,
    BaseGameObjectDummyBotGameObject: botBase,
    DiamondGameObjectBotGameObject: botDiamond,
    DiamondGameObjectDummyBotGameObject: botDiamond,
    BotGameObjectDiamondGameObject: botDiamond,
    DummyBotGameObjectDiamondGameObject: botDiamond,
    TeleportGameObject: teleporter,
    BotGameObjectTeleportGameObject: teleporter,
    DummyBotGameObjectTeleportGameObject: teleporter,
    TeleportGameObjectBotGameObject: teleporter,
    TeleportGameObjectDummyBotGameObject: teleporter,
  };

  if (
    gameObject.type === 'DiamondGameObject' &&
    (gameObject.properties as IDiamond)
  ) {
    const diamond = gameObject.properties as IDiamond;
    if (diamond.points === 2) {
      return diamondRed;
    }
  }

  return goImgMap[gameObject.type as GameObjectType];
};

const getCharacterName = (gameObject: GameObject) => {
  const name = gameObject.properties?.name || '';

  return name;
};

// TODO: Fix types in this component
export const Cell: FC<CellProps> = memo((props) => {
  const { gameObject, id } = props;

  return (
    <div
      key={id}
      className={`border-l w-full aspect-square relative overflow-hidden ${
        gameObject && gameObject.type
          ? 'flex items-center justify-center'
          : 'justify-center'
      }`}
    >
      {gameObject && gameObject.type && (
        <div className="flex flex-col w-full">
          <p className="text-[6px] text-black dark:text-white max-w-[98%] self-center sm:text-[10px] overflow-hidden whitespace-nowrap truncate">
            {getCharacterName(gameObject)}
          </p>
          <img
            src={getGameCharacter(gameObject)}
            className={`w-[70%] h-[70%] self-center ${
              gameObject.type.includes('Teleport') ? 'rotate' : ''
            } ${gameObject.type.includes('DiamondGame') ? 'diamond' : ''}`}
          />
          {gameObject.type.includes('DiamondGame') &&
            !gameObject.type.includes('Bot') && (
              <div className="sparkles w-[70%] h-[70%] absolute top-1/2 left-1/2 overflow-hidden z-2">
                <div className="star text-transparent text-[0.4rem] sm:text-[0.5rem] md:text-[0.5rem] lg:text-[0.7rem] absolute">
                  ✨
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
});
