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
  gameObject: IGameObjectDto;
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
      {gameObject &&
        gameObject.type &&
        renderGameCharacterComponent(gameObject)}
    </div>
  );
});
