import { FC } from 'react';
import { GameObjectProps } from '../Board/Cell';
import { teleporter } from '../images';
import { CommonGameObject } from './CommonGameObject';

export const TeleportComponent: FC<GameObjectProps> = ({}) => {
  const characterImg = teleporter;
  const imageClassName = 'rotate';
  return (
    <CommonGameObject
      characterImg={characterImg}
      imageClassName={imageClassName}
    />
  );
};
