import React, { FC, memo, useState } from 'react';
import { BoardPicker } from '../BoardPicker';
import { HighScoreTable } from '../HighScoreTable';
import { Rules } from '../Rules';
import { SeasonPicker } from '../SeasonPicker';
import { PlayerTable } from '../PlayerTable';

export const SideMenu: FC = memo(() => {
  // const currentSeason = getCurrentSeason();
  // const [rows, bots] = useBoard(boardId, delay);
  const [boardId, setBoardId] = useState(1);
  const [seasonId, setSeasonId] = useState('0');
  const delay = 2000; // 0.25 s
  const [rulesVisible, setRulesVisible] = useState<boolean>(false);

  const onBoardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardId(parseInt(event.target.value));
  };

  const onSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSeasonId(event.target.value);
  };


  const closeRules = () => {
    setRulesVisible(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-y-scroll flex flex-col p-4">
      <div className="mb-6">
        <BoardPicker boardId={boardId} onChange={onBoardChange}/>
      </div>

      <div>
        <PlayerTable boardId={boardId} />
      </div>

      <div className="my-6">
        <SeasonPicker seasonId={seasonId} onChange={onSeasonChange}/>

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
        <HighScoreTable seasonId={seasonId}/>
      </div>

      <Rules onClose={closeRules} visible={rulesVisible} seasonId={seasonId} />
    </div>
  );
});
SideMenu.displayName = 'SideMenu';
