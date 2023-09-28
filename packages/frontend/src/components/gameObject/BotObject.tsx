import { BotGameObjectProperties } from '@etimo/diamonds2-types';
import { FC, memo } from 'react';
import { robot } from '../images';
import { CommonGameObject } from './CommonGameObject';

export const BotComponent: FC<BotGameObjectProperties> = memo(({ name }) => {
  return <CommonGameObject characterName={name} characterImg={robot} />;
});
