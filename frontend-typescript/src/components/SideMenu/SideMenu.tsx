import React, { FC, memo, useState } from 'react';
import { Select } from '../Inputs';
import { Rules } from '../Rules';
import { Table } from '../Table';

export const SideMenu: FC = memo(() => {
  // const currentSeason = getCurrentSeason();
  // const [rows, bots] = useBoard(boardId, delay);
  const [boardId, setBoardId] = useState(1);
  const [seasonId, setSeasonId] = useState(0);
  const delay = 2000; // 0.25 s
  const [rulesVisible, setRulesVisible] = useState<boolean>(false);

  const onBoardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setBoardId(event.target.value);
  };

  const onSeasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setSeasonId(event.target.value);
  };

  const closeRules = () => {
    setRulesVisible(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-y-scroll flex flex-col p-4">
      <div className="mb-6">
        <Select
          label="Select board"
          onChange={() => {}}
          options={['']}
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

        <div className="mt-2">
          <button
            onClick={() => setRulesVisible(true)}
            className="font-sans text-etimo text-xs font-normal"
          >
            Season rules
          </button>
        </div>
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

      <Rules onClose={closeRules} visible={rulesVisible} seasonId={seasonId} />
    </div>
  );
});
SideMenu.displayName = 'SideMenu';
