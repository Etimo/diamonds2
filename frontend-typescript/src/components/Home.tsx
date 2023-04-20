import { useState } from 'react';
import { useBoard } from '../hooks/useBoard';
import { Board } from './Board';
import { SideMenu } from './SideMenu';

export const Home = () => {
  const [boardId, setBoardId] = useState(1);
  const { board, bots } = useBoard(boardId, 250);

  const onBoardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardId(parseInt(event.target.value));
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-800 w-screen h-screen flex flex-col mt-5">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_30%] mx-4 gap-4 lg:mx-14 lg:p-0">
        <Board board={board} />

        <SideMenu bots={bots} boardId={boardId} onBoardChange={onBoardChange} />
      </div>
    </div>
  );
};
