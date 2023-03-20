import { FC, memo } from 'react';
import diamond from '../../assets/diamond.svg';
import useBoard from '../../hooks/useBoard';
import { botBase, home, robot, teleporter } from '../images';

type BoardProps = {
  boardId: number;
};

export const Board: FC<BoardProps> = memo((props) => {
  const { boardId } = props;
  const board = useBoard(boardId, 2000);

  // TODO: get current season and use it to get the board config instead of using test data //Klara
  const numberOfRows = 10;
  const numberOfColumns = 10;
  // const currentSeason = useCurrentSeason();
  return (
    <div className=" items-center flex flex-col relative w-3/4 m-auto">
      {Array(numberOfRows)
        .fill(0)
        .map((row, rowIndex) => {
          return (
            <div
              key={rowIndex}
              className="items-center flex flex-row border w-full h-full "
            >
              {Array(numberOfColumns)
                .fill(0)
                .map((cell, columnIndex) => {
                  let cellIndex = rowIndex * numberOfColumns + columnIndex;
                  if (!board[cellIndex]) {
                    return (
                      <div
                        key={columnIndex}
                        className="border-x justify-center w-full aspect-square"
                      ></div>
                    );
                  } else if (board[cellIndex]?.type === 'diamond') {
                    return (
                      <div
                        key={columnIndex}
                        className="border-x w-full aspect-square flex items-center justify-center"
                      >
                        <img src={diamond} className=" w-3/4 h-3/4" />
                      </div>
                    );
                  } else if (board[cellIndex]?.type === 'robot') {
                    return (
                      <div
                        key={columnIndex}
                        className="border-x w-full aspect-square flex items-center justify-center"
                      >
                        <img src={robot} className=" w-3/4 h-3/4" />
                      </div>
                    );
                  } else if (board[cellIndex]?.type === 'teleporter') {
                    return (
                      <div
                        key={columnIndex}
                        className="border-x w-full aspect-square flex items-center justify-center"
                      >
                        <img src={teleporter} className=" w-3/4 h-3/4" />
                      </div>
                    );
                  } else if (board[cellIndex]?.type === 'botBase') {
                    return (
                      <div
                        key={columnIndex}
                        className="border-x w-full aspect-square flex items-center justify-center"
                      >
                        <img src={botBase} className=" w-3/4 h-3/4" />
                      </div>
                    );
                  } else if (board[cellIndex]?.type === 'home') {
                    return (
                      <div
                        key={columnIndex}
                        className="border-x w-full aspect-square flex items-center justify-center"
                      >
                        <img src={home} className=" w-3/4 h-3/4" />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={columnIndex}
                        className="border-x justify-center w-full aspect-square"
                      >
                        {board[cellIndex]?.type}
                      </div>
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
