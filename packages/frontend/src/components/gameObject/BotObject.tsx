import { BotGameObjectProperties } from '@etimo/diamonds2-types';
import { FC, memo } from 'react';
import { robot } from '../images';
import { CommonGameObject } from './CommonGameObject';

// const getCharacterName = (gameObject: GameObject): string =>
//   gameObject.properties?.name || '';

// const getCharacterImg = (gameObject: GameObject): string => {
//   const botType = gameObject.type.includes('Diamond') ? botDiamond : robot;
//   return botType;
// };

export const BotComponent: FC<BotGameObjectProperties> = memo(({ name }) => {
  return <CommonGameObject characterName={name} characterImg={robot} />;
});
