import { FC, memo } from 'react';
import { Select } from '../Inputs';
import { Table } from '../Table';

export const SideMenu: FC = memo(() => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-y-scroll flex flex-col p-4">
      <div className="mb-6">
        <Select
          label="Select board"
          onChange={() => {}}
          options={[]}
          value={''}
        />
      </div>

      <div>
        <Table
          label="Board 1 Players"
          cols={['Name', 'Diamonds', 'Score', 'Time']}
          data={[
            { name: 'Etimo 1', diamonds: 3, score: 5, time: 32 },
            { name: 'Etimo 2', diamonds: 0, score: 1, time: 20 },
          ]}
        />
      </div>

      <div className="my-6">
        <Select
          label="Select season"
          onChange={() => {}}
          options={[]}
          value={''}
        />
      </div>

      <div>
        <Table
          label="Highscore"
          cols={['Name', 'Team', 'Score']}
          data={[
            { name: 'Etimo 1', Team: 'Etimo', score: 5 },
            { name: 'Etimo 2', Team: 'Etimo', score: 1 },
          ]}
        />
      </div>
    </div>
  );
});
SideMenu.displayName = 'SideMenu';
