import { type FC, memo } from "react";
import type { GameBoard } from "../../hooks/useBoard.ts";
import useResize from "../../hooks/useResize.ts";
import { Cell } from "./Cell.tsx";

type BoardProps = {
  board: GameBoard;
};

export const Board: FC<BoardProps> = memo((props) => {
  const { board } = props;

  const [containerRef, maxWidth] = useResize({
    root: document.querySelector("#test"),
    rootMargin: "0px",
    threshold: 0,
  });

  return (
    <div
      id="test"
      className="items-center flex flex-col relative m-auto border-t w-full lg:w-80%"
      ref={containerRef}
      style={{ maxWidth: maxWidth.maxWidth }}
    >
      {board.grid.map((row, rowIndex) => {
        return (
          <div
            key={rowIndex}
            className="items-center flex flex-row border-r border-b w-full h-full"
          >
            {row.map((cell, columnIndex) => (
              <Cell
                id={`row ${rowIndex} column ${columnIndex}`}
                key={`row ${rowIndex} column ${columnIndex}`}
                gameObjects={cell}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
});
