import { FC, memo } from 'react';
import { GameObject } from '../../hooks/useBoard';
import { GameObjectProps } from '../Board/Cell';
import { botDiamond, robot } from '../images';
import { CommonGameObject } from './CommonGameObject';

const getCharacterName = (gameObject: GameObject): string =>
  gameObject.properties?.name || '';

const getCharacterImg = (gameObject: GameObject): string => {
  const botType = gameObject.type.includes('Diamond') ? botDiamond : robot;
  return botType;
};

export const BotComponent: FC<GameObjectProps> = memo(({ gameObject }) => {
  const characterName = getCharacterName(gameObject);
  const characterImg = getCharacterImg(gameObject);

  return (
    <CommonGameObject
      characterName={characterName}
      characterImg={characterImg}
    />
  );
});
