import { FC, memo } from 'react';
import { GameObject } from '../../hooks/useBoard';
import { GameObjectProps } from '../Board/Cell';
import { diamond, diamondRed } from '../images';
import { CommonGameObject } from './CommonGameObject';
import { SparklesComponent } from './SparklesComponent';

const getCharacterImg = (gameObject: GameObject): string => {
  const diamondType =
    gameObject.properties?.points === 2 ? diamondRed : diamond;
  return diamondType;
};

export const DiamondComponent: FC<GameObjectProps> = memo(({ gameObject }) => {
  const characterImg = getCharacterImg(gameObject);
  const imageClassName = 'diamond';
  return (
    <>
      <CommonGameObject
        characterImg={characterImg}
        imageClassName={imageClassName}
      />
      <SparklesComponent />
    </>
  );
});
