import { IGameObjectDto } from '@etimo/diamonds2-types';
import { FC, memo } from 'react';
import {
  BaseComponent,
  BotComponent,
  DiamondButtonComponent,
  DiamondComponent,
  TeleportComponent,
} from '../gameObject';

type CellProps = {
  gameObjects: IGameObjectDto[];
  id: string;
};

const renderGameCharacterComponent = (gameObject: IGameObjectDto) => {
  switch (gameObject.type) {
    case 'BotGameObject':
    case 'DummyBotGameObject':
      return <BotComponent {...gameObject.properties} />;
    case 'DiamondGameObject':
      return <DiamondComponent {...gameObject.properties} />;
    case 'BaseGameObject':
      return <BaseComponent {...gameObject.properties} />;
    case 'TeleportGameObject':
      return <TeleportComponent />;
    case 'DiamondButtonGameObject':
      return <DiamondButtonComponent />;
    default:
      return null;
  }
};

export const Cell: FC<CellProps> = memo((props) => {
  const { gameObjects, id } = props;

  const lastGameObject =
    gameObjects.length > 0 ? gameObjects[gameObjects.length - 1] : null;

  return (
    <div
      key={id}
      className={`border-l w-full aspect-square relative overflow-hidden ${
        gameObjects && gameObjects.length > 0
          ? 'flex items-center justify-center'
          : 'justify-center'
      }`}
    >
      {lastGameObject && renderGameCharacterComponent(lastGameObject)}
    </div>
  );
});
