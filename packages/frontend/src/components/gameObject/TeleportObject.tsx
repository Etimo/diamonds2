import { FC } from 'react';
import { teleporter } from '../images';
import { CommonGameObject } from './CommonGameObject';

export const TeleportComponent: FC = () => (
  <CommonGameObject characterImg={teleporter} imageClassName={'rotate'} />
);
