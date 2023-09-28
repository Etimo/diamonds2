import { FC } from 'react';
import { redButton } from '../images';
import { CommonGameObject } from './CommonGameObject';

export const DiamondButtonComponent: FC = () => {
  const characterImg = redButton;

  return <CommonGameObject characterImg={characterImg} />;
};
