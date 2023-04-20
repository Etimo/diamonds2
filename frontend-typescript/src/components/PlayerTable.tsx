import { FC, memo } from 'react';
import { IBot } from '../hooks/useBoard';
import { Table } from './Table';

type PlayerTableProps = {
  bots: IBot[];
};

export const PlayerTable: FC<PlayerTableProps> = memo((props) => {
  const bots = props.bots;

  return (
    <Table
      label="Board 1 Players"
      cols={['Name', 'Diamonds', 'Score', 'Time']}
      data={bots}
    />
  );
});
