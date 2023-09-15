import { FC, memo } from 'react';
import {
  GameObjectType,
  IBase,
  IBot,
  IDiamond,
  IGameObject,
} from '../../hooks/useBoard';
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
  gameObject: IGameObject | null;
  id: string;
};

type GameObjectMap = {
  [key in GameObjectType]: string;
};

// TODO: Fix types in this component
const getGameCharacter = (gameObject: IGameObject) => {
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
    (gameObject.object as IDiamond)
  ) {
    const diamond = gameObject.object as IDiamond;
    if (diamond.points === 2) {
      return diamondRed;
    }
  }

  return goImgMap[gameObject.type as GameObjectType];
};

const getCharacterName = (gameObject: IGameObject) => {
  if (gameObject.object as IBase) {
    const base = gameObject.object as IBase;
    if (base.name) return base.name.substring(0, 3);
    return base.name;
  } else if (gameObject.object as IBot) {
    const bot = gameObject.object as IBot;
    if (bot.name) return bot.name.substring(0, 3);
    return bot.name;
  }
  return '';
};

export const Cell: FC<CellProps> = memo((props) => {
  const { gameObject, id } = props;

  return (
    <div
      key={id}
      className={`border-l w-full aspect-square ${
        gameObject && (gameObject.type as GameObjectType)
          ? 'flex items-center justify-center'
          : 'justify-center'
      }`}
    >
      {gameObject && (gameObject.type as GameObjectType) && (
        <div className="flex flex-col w-full">
          <p className="text-[10px] text-black dark:text-white w-100 self-center">
            {getCharacterName(gameObject)}
          </p>
          <img
            src={getGameCharacter(gameObject)}
            className="w-[70%] h-[70%] self-center"
          />
        </div>
      )}
    </div>
  );
});
