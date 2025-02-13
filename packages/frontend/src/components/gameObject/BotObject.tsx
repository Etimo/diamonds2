import { BotGameObjectProperties } from '@etimo/diamonds2-types';
import { FC, memo } from 'react';
import { robot1, robot2, robot3 } from '../images';
import { CommonGameObject } from './CommonGameObject';

const images = [robot1, robot2, robot3];

export const BotComponent: FC<BotGameObjectProperties> = memo(({ name }) => (
  <CommonGameObject
    characterName={name}
    characterImg={getRandomBotImage()}
    imageClassName="bot"
    index={10}
  />
));

const getRandomBotImage = () => {
  // Get random number between 1 and 3
  const randomIndex = Math.floor(Math.random() * 3);
  console.log('randomIndex', randomIndex);
  return images[randomIndex];
};
