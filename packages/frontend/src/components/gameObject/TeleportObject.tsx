import { FC } from 'react';
import { teleporter } from '../images';
import { CommonGameObject } from './CommonGameObject';

export const TeleportComponent: FC = () => {
  const characterImg = teleporter;
  const imageClassName = 'rotate';
  return (
    <CommonGameObject
      characterImg={characterImg}
      imageClassName={imageClassName}
    />
  );
};
