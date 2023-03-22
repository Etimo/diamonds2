import { FC, memo } from 'react';
import useBoard from '../../hooks/useBoard';
import { Cell } from './Cell';

type BoardProps = {
  boardId: number;
};

export const Board: FC<BoardProps> = memo((props) => {
  const { boardId } = props;
  const board = useBoard(boardId, 2000);

  return (
    <div className=" items-center flex flex-col relative w-3/4 m-auto">
      {board.rows.map((row, rowIndex) => {
        return (
          <div
            key={rowIndex}
            className="items-center flex flex-row border w-full h-full "
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
  );
});

export interface IBoardCell {}
