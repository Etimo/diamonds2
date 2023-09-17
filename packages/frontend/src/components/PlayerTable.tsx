import { FC, memo } from 'react';
import { IBot } from '../hooks/useBoard';
import { Table } from './Table';

type PlayerTableProps = {
  bots: IBot[];
  boardId: number;
};

export const PlayerTable: FC<PlayerTableProps> = memo((props) => {
  const { bots, boardId } = props;

  return (
    <Table
      label={`Board ${boardId} players`}
      cols={['Name', 'Diamonds', 'Score', 'Time']}
      data={bots}
    />
  );
});
