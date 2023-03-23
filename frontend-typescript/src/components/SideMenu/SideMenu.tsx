import React, { FC, memo, useState } from 'react';
import { IBot } from '../../hooks/useBoard';
import useFetch from '../../hooks/useFetch';
import { BoardPicker } from '../BoardPicker';
import { HighScoreTable } from '../HighScoreTable';
import { PlayerTable } from '../PlayerTable';
import { Rules } from '../Rules';
import { SeasonPicker } from '../SeasonPicker';

type SideMenuProps = {
  boardId: number;
  onBoardChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  bots: IBot[];
};

export const SideMenu: FC<SideMenuProps> = memo((props) => {
  const { boardId, onBoardChange, bots } = props;

  const {
    response: currentSeason,
    error,
    isLoading,
  } = useFetch('api/seasons/current', '0');

  // const [rows, bots] = useBoard(boardId, delay);
  //const [boardId, setBoardId] = useState(1);
  const [seasonId, setSeasonId] = useState<string>('0');
  const delay = 2000; // 0.25 s
  const [rulesVisible, setRulesVisible] = useState<boolean>(false);

  const onSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSeasonId(event.target.value);
  };

  const closeRules = () => {
    setRulesVisible(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-y-scroll flex flex-col p-4">
      <div className="mb-6">
        <BoardPicker boardId={boardId} onChange={onBoardChange} />
      </div>

      <div>
        <PlayerTable bots={bots} />
      </div>

      <div className="my-6">
        <SeasonPicker
          seasonId={seasonId != '0' ? seasonId : currentSeason.id}
          onChange={onSeasonChange}
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
        <HighScoreTable
          seasonId={seasonId != '0' ? seasonId : currentSeason.id}
        />
      </div>

      <Rules
        onClose={closeRules}
        visible={rulesVisible}
        seasonId={seasonId != '0' ? seasonId : currentSeason.id}
      />
    </div>
  );
});
SideMenu.displayName = 'SideMenu';
