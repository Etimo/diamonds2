import { BaseGameObjectProperties } from '@etimo/diamonds2-types';
import { FC, memo } from 'react';
import { base } from '../images';
import { CommonGameObject } from './CommonGameObject';

export const BaseComponent: FC<BaseGameObjectProperties> = memo(({ name }) => (
  <CommonGameObject characterName={name} characterImg={base} />
));
