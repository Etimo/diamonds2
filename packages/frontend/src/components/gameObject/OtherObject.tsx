import { FC, memo } from 'react';
import { GameObject } from '../../hooks/useBoard';
import { GameObjectProps } from '../Board/Cell';
import { redButton, wall } from '../images';
import { CommonGameObject } from './CommonGameObject';

const getCharacterImg = (gameObject: GameObject): string => {
  const type = gameObject.type.includes('Button')
    ? redButton
    : gameObject.type.includes('Wall')
    ? wall
    : '';
  return type;
};

export const OtherComponent: FC<GameObjectProps> = memo(({ gameObject }) => {
  if (!getCharacterImg(gameObject)) {
    return null;
  }
  const characterImg = getCharacterImg(gameObject);

  return <CommonGameObject characterImg={characterImg} />;
});
