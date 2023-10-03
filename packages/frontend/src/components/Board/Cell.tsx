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

  const renderGameObject = (gameObject: IGameObjectDto, index: number) => (
    <div key={index} className="absolute w-[100%]">
      {renderGameCharacterComponent(gameObject)}
    </div>
  );

  return (
    <div
      key={id}
      className={`border-l w-full aspect-square relative overflow-hidden ${
        gameObjects && gameObjects.length > 0
          ? 'flex items-center justify-center'
          : 'justify-center'
      }`}
    >
      {gameObjects.map((gameObject, index) =>
        renderGameObject(gameObject, index),
      )}
    </div>
  );
});
