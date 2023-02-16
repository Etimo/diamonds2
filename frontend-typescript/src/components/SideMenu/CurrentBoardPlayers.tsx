import { FC, memo } from 'react';
import { Table } from '../Table';

export const CurrentBoardPlayers: FC = memo(() => {
  return (
    <div>
      <label className="text-label mb-2.5">Board 1 Players</label>
      <Table
        cols={['Name', 'Diamonds', 'Score', 'Time']}
        data={[
          { name: 'Etimo 1', diamonds: 3, score: 5, time: 32 },
          { name: 'Etimo 2', diamonds: 0, score: 1, time: 20 },
        ]}
      />
    </div>
  );
});
CurrentBoardPlayers.displayName = 'CurrentBoardPlayers';
