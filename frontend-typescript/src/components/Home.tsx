import { useState } from 'react';
import { Board } from './Board';
import { SideMenu } from './SideMenu';

export const Home = () => {
  const [boardId, setBoardId] = useState(1);

  const onBoardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardId(parseInt(event.target.value));
  };
  return (
    <div className="bg-white w-screen h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_30%] px-4 pb-4 ">
        <Board boardId={boardId} />
        <SideMenu boardId={boardId} onBoardChange={onBoardChange} />
      </div>
    </div>
  );
};
