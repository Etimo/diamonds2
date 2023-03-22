import { FC, memo } from 'react';
import {
  botBase,
  diamond,
  home,
  redButton,
  robot,
  teleporter,
} from '../images';

type CellProps = {
  type: string;
  id: string;
};

export const Cell: FC<CellProps> = memo((props) => {
  const { type, id } = props;

  //TODO: add more types//Klara

  if (type === 'DiamondGameObject') {
    return (
      <div
        key={id}
        className="border-x w-full aspect-square flex items-center justify-center"
      >
        <img src={diamond} className=" w-3/4 h-3/4" />
      </div>
    );
  } else if (type === 'robot') {
    return (
      <div
        key={id}
        className="border-x w-full aspect-square flex items-center justify-center"
      >
        <img src={robot} className=" w-3/4 h-3/4" />
      </div>
    );
  } else if (type === 'DiamondButtonGameObject') {
    //TODO: Make red diamonds red //Klara
    return (
      <div
        key={id}
        className="border-x w-full aspect-square flex items-center justify-center"
      >
        <img src={redButton} className=" w-3/4 h-3/4" />
      </div>
    );
  } else if (type === 'TeleportGameObject') {
    return (
      <div
        key={id}
        className="border-x w-full aspect-square flex items-center justify-center"
      >
        <img src={teleporter} className=" w-3/4 h-3/4" />
      </div>
    );
  } else if (type === 'botBase') {
    return (
      <div
        key={id}
        className="border-x w-full aspect-square flex items-center justify-center"
      >
        <img src={botBase} className=" w-3/4 h-3/4" />
      </div>
    );
  } else if (type === 'home') {
    return (
      <div
        key={id}
        className="border-x w-full aspect-square flex items-center justify-center"
      >
        <img src={home} className=" w-3/4 h-3/4" />
      </div>
    );
  } else {
    return (
      <div key={id} className="border-x justify-center w-full aspect-square">
        {type}
      </div>
    );
  }
});
