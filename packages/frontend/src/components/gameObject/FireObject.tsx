import { FireGameObjectProperties } from '@etimo/diamonds2-types';
import { FC, memo } from 'react';
import { fire } from '../images';
import { CommonGameObject } from './CommonGameObject';

export const FireComponent: FC<FireGameObjectProperties> = memo(
  ({ takeDiamonds }) => {
    return (
      <>
        <CommonGameObject characterImg={fire} imageClassName="fire" />
      </>
    );
  },
);
