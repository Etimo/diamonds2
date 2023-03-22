import { FC, memo } from 'react';
import useBoard from '../../hooks/useBoard';
import useResize from '../../hooks/useResize';
import { Cell } from './Cell';

type BoardProps = {
  boardId: number;
};

export const Board: FC<BoardProps> = memo((props) => {
  const { boardId } = props;
  const board = useBoard(boardId, 2000);
  const [containerRef, maxWidth] = useResize({
    root: document.querySelector('#test'),
    rootMargin: '0px',
    threshold: 0,
  });
  // console.log(maxWidth.maxWidth);
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
                  if (cell.type) {
                    return (
                      <Cell
                        id={`row ${rowIndex} column ${columnIndex}`}
                        key={`row ${rowIndex} column ${columnIndex}`}
                        type={cell.type}
                      />
                    );
                  } else {
                    return (
                      <Cell
                        key={`row ${rowIndex} column ${columnIndex}`}
                        id={`row ${rowIndex}`}
                        type={''}
                      />
                    );
                  }
                } else {
                  return (
                    <Cell
                      key={`row ${rowIndex} column ${columnIndex}`}
                      id={`row ${rowIndex}`}
                      type={''}
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
