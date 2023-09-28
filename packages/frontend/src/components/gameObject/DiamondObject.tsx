import { DiamondGameObjectProperties } from '@etimo/diamonds2-types';
import { FC, memo } from 'react';
import { diamond, diamondRed } from '../images';
import { CommonGameObject } from './CommonGameObject';
import { SparklesComponent } from './SparklesComponent';

const getCharacterImg = (points: number): string => {
  if (points === 2) {
    return diamondRed;
  }
  return diamond;
};

export const DiamondComponent: FC<DiamondGameObjectProperties> = memo(
  ({ points }) => {
    const characterImg = getCharacterImg(points);
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
  },
);
