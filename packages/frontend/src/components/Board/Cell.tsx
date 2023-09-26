import { FC, memo } from 'react';
import { GameObject } from '../../hooks/useBoard';
import { GameObjectComponent } from '../gameObject';

type CellProps = {
  gameObject: GameObject;
  id: string;
};

// TODO: Fix types in this component
export const Cell: FC<CellProps> = memo((props) => {
  const { gameObject, id } = props;

  return (
    // set cell size
    <div
      key={id}
      className={`border-l w-full aspect-square relative overflow-hidden ${
        gameObject && gameObject.type
          ? 'flex items-center justify-center'
          : 'justify-center'
      }`}
    >
      {gameObject && gameObject.type && (
        <GameObjectComponent gameObject={gameObject} />
      )}
    </div>
  );
});
