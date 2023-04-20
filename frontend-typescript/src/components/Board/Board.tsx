import { FC, memo } from 'react';
import { IBoard } from '../../hooks/useBoard';
import useResize from '../../hooks/useResize';
import { Cell } from './Cell';

type BoardProps = {
  board: IBoard;
};

export const Board: FC<BoardProps> = memo((props) => {
  const { board } = props;
  const [containerRef, maxWidth] = useResize({
    root: document.querySelector('#test'),
    rootMargin: '0px',
    threshold: 0,
  });
  return (
    <div id="test">
      <div
        className=" items-center flex flex-col relative m-auto border-t w-3/4"
        ref={containerRef}
        style={{ maxWidth: maxWidth.maxWidth }}
      >
        {board.rows.map((row, rowIndex) => {
          return (
            <div
              key={rowIndex}
              className="items-center flex flex-row border-r border-b w-full h-full "
            >
              {row.map((cell, columnIndex) => {
                if (cell) {
                  if (cell) {
                    return (
                      <Cell
                        id={`row ${rowIndex} column ${columnIndex}`}
                        key={`row ${rowIndex} column ${columnIndex}`}
                        gameObject={cell}
                      />
                    );
                  }
                } else {
                  return (
                    <Cell
                      key={`row ${rowIndex} column ${columnIndex}`}
                      id={`row ${rowIndex}`}
                      gameObject={null}
                    />
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export interface IBoardCell {}
