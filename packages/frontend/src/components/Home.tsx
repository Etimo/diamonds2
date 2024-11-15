import { useState } from "react";
import { useBoard } from "../hooks/useBoard.ts";
import { Board } from "./Board/index.ts";
import { SideMenu } from "./SideMenu/index.ts";

export const Home = () => {
  const [boardId, setBoardId] = useState(1);
  const { board, bots } = useBoard(boardId, 250);

  const onBoardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardId(parseInt(event.target.value));
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-800 w-screen min-h-[70vh] flex flex-col my-5">
      <div className="flex-1 grid grid-cols lg:grid-cols-[1fr_30%] mx-4 gap-4 lg:mx-14 lg:p-0">
        <Board board={board} />

        <SideMenu bots={bots} boardId={boardId} onBoardChange={onBoardChange} />
      </div>
    </div>
  );
};
