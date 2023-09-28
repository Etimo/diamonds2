import { FC, memo } from 'react';
import { GameObject } from '../../hooks/useBoard';
import {
  BaseComponent,
  BotComponent,
  DiamondComponent,
  OtherComponent,
  TeleportComponent,
} from '../gameObject';

const componentMap: Record<string, FC<GameObjectProps>> = {
  // GameObject types
  Teleporter: TeleportComponent,
  Wall: OtherComponent,
  DiamondButtonGameObject: OtherComponent,
  DiamondGameObject: DiamondComponent,
  BotGameObject: BotComponent,
  DummyBotGameObject: BotComponent,
  BaseGameObject: BaseComponent,

  // GameObject combinations
  BotGameObjectBaseGameObject: BaseComponent,
  DummyBotGameObjectBaseGameObject: BaseComponent,
  BaseGameObjectBotGameObject: BaseComponent,
  BaseGameObjectDummyBotGameObject: BaseComponent,
  DiamondGameObjectDiamondGameObject: DiamondComponent,
  DiamondGameObjectBotGameObject: BotComponent,
  DiamondGameObjectDummyBotGameObject: BotComponent,
  BotGameObjectDiamondGameObject: BotComponent,
  DummyBotGameObjectDiamondGameObject: BotComponent,

  // Teleport-related GameObjects
  TeleportGameObject: TeleportComponent,
  BotGameObjectTeleportGameObject: TeleportComponent,
  DummyBotGameObjectTeleportGameObject: TeleportComponent,
  TeleportGameObjectBotGameObject: TeleportComponent,
  TeleportGameObjectDummyBotGameObject: TeleportComponent,
};

type CellProps = {
  gameObject: GameObject;
  id: string;
};

export type GameObjectProps = {
  gameObject: GameObject;
};

const renderGameCharacterComponent = (gameObject: GameObject) => {
  const componentType = gameObject.type;

  const Component = componentMap[componentType] || OtherComponent;

  return <Component gameObject={gameObject} />;
};

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
        <>{renderGameCharacterComponent(gameObject)}</>
      )}
    </div>
  );
});
