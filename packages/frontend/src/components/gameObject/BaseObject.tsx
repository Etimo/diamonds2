import { FC, memo } from 'react';
import { GameObject } from '../../hooks/useBoard';
import { GameObjectProps } from '../Board/Cell';
import { base, botBase } from '../images';
import { CommonGameObject } from './CommonGameObject';

const getCharacterName = (gameObject: GameObject): string =>
  gameObject.properties?.name || '';

const getCharacterImg = (gameObject: GameObject): string => {
  const baseType = gameObject.type.includes('Bot') ? botBase : base;
  return baseType;
};

export const BaseComponent: FC<GameObjectProps> = memo(({ gameObject }) => {
  const characterName = getCharacterName(gameObject);
  const characterImg = getCharacterImg(gameObject);

  return (
    <CommonGameObject
      characterName={characterName}
      characterImg={characterImg}
    />
  );
});
