import { FC, memo } from 'react';
import { GameObject, GameObjectType } from '../../hooks/useBoard';
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

type GameObjectProps = {
  gameObject: GameObject;
};

type GameObjectMap = {
  [key in GameObjectType]: string;
};

const getCharacterName = (gameObject: GameObject) =>
  gameObject.properties?.name || '';

const getCharacterImg = (gameObject: GameObject) => {
  const goImgMap: GameObjectMap = {
    // GameObject types
    Teleporter: teleporter,
    Wall: wall,
    DiamondButtonGameObject: redButton,
    DiamondGameObject: diamond,
    BotGameObject: robot,
    DummyBotGameObject: robot,
    BaseGameObject: base,

    // GameObject combinations
    BotGameObjectBaseGameObject: botBase,
    DummyBotGameObjectBaseGameObject: botBase,
    BaseGameObjectBotGameObject: botBase,
    BaseGameObjectDummyBotGameObject: botBase,
    DiamondGameObjectDiamondGameObject: diamond,
    DiamondGameObjectBotGameObject: botDiamond,
    DiamondGameObjectDummyBotGameObject: botDiamond,
    BotGameObjectDiamondGameObject: botDiamond,
    DummyBotGameObjectDiamondGameObject: botDiamond,

    // Teleport-related GameObjects
    TeleportGameObject: teleporter,
    BotGameObjectTeleportGameObject: teleporter,
    DummyBotGameObjectTeleportGameObject: teleporter,
    TeleportGameObjectBotGameObject: teleporter,
    TeleportGameObjectDummyBotGameObject: teleporter,
  };

  if (gameObject.type === 'DiamondGameObject' && gameObject.properties) {
    const diamondType =
      gameObject.properties?.points === 2 ? diamondRed : diamond;
    return diamondType;
  }
  return goImgMap[gameObject.type];
};

export const GameObjectComponent: FC<GameObjectProps> = memo(
  ({ gameObject }) => {
    const isTeleporter = gameObject.type.includes('Teleport');
    const isDiamond =
      gameObject.type.includes('DiamondGame') &&
      !gameObject.type.includes('Bot');

    return (
      <div className="flex flex-col w-full">
        <p className="text-[6px] text-black dark:text-white max-w-[98%] self-center sm:text-[10px] overflow-hidden whitespace-nowrap truncate">
          {getCharacterName(gameObject)}
        </p>
        <img
          src={getCharacterImg(gameObject)}
          className={`w-[70%] h-[70%] self-center
          ${isTeleporter ? 'rotate' : ''}
          ${isDiamond ? 'diamond' : ''}`}
        />
        {isDiamond && (
          <div className="sparkles w-[70%] h-[70%] absolute top-1/2 left-1/2 overflow-hidden z-2">
            <div className="star text-transparent text-[0.4rem] sm:text-[0.5rem] md:text-[0.5rem] lg:text-[0.7rem] absolute">
              ✨
            </div>
          </div>
        )}
      </div>
    );
  },
);
