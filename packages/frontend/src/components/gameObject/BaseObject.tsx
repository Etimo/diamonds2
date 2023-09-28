import { BaseGameObjectProperties } from '@etimo/diamonds2-types';
import { FC, memo } from 'react';
import { base } from '../images';
import { CommonGameObject } from './CommonGameObject';

// const getCharacterName = (gameObject: GameObject): string =>
//   gameObject.properties?.name || '';

// const getCharacterImg = (gameObject: GameObject): string => {
//   const baseType = gameObject.type.includes('Bot') ? botBase : base;
//   return baseType;
// };

export const BaseComponent: FC<BaseGameObjectProperties> = memo(({ name }) => {
  return <CommonGameObject characterName={name} characterImg={base} />;
});
