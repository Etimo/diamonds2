import { DiamondGameObjectProperties } from '@etimo/diamonds2-types';
import { FC, memo } from 'react';
import { diamond, diamondRed } from '../images';
import { CommonGameObject } from './CommonGameObject';
import { SparklesComponent } from './SparklesComponent';

export const DiamondComponent: FC<DiamondGameObjectProperties> = memo(
  ({ points }) => {
    const characterImg = points === 2 ? diamondRed : diamond;
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
