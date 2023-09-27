import { BotGameObjectProperties } from '@etimo/diamonds2-types';
import React, { FC, memo, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { BoardPicker } from '../BoardPicker';
import { HighScoreTable } from '../HighScoreTable';
import { PlayerTable } from '../PlayerTable';
import { Rules } from '../Rules';
import { SeasonPicker } from '../SeasonPicker';

type SideMenuProps = {
  boardId: number;
  onBoardChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  bots: BotGameObjectProperties[];
};

export const SideMenu: FC<SideMenuProps> = memo((props) => {
  const { boardId, onBoardChange, bots } = props;
  const { response: currentSeason } = useFetch('api/seasons/current', '0');
  const defaultSeasonId = '00000000-0000-0000-0000-000000000000';

  const [seasonId, setSeasonId] = useState<string>(defaultSeasonId);
  const [rulesVisible, setRulesVisible] = useState<boolean>(false);

  const onSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSeasonId(event.target.value);
  };

  const closeRules = () => {
    setRulesVisible(false);
  };

  const selectedSeasonId = seasonId !== '0' ? seasonId : currentSeason.id;

  return (
    <div className="border border-gray-200 dark:border-slate-400 rounded-lg overflow-y-auto flex flex-col p-4">
      <div className="mb-6">
        <BoardPicker boardId={boardId} onChange={onBoardChange} />
      </div>

      <div>
        <PlayerTable bots={bots} boardId={boardId} />
      </div>

      <div className="my-6">
        <SeasonPicker seasonId={selectedSeasonId} onChange={onSeasonChange} />

        <div className="mt-2">
          <button
            onClick={() => setRulesVisible(true)}
            className="font-sans text-etimo dark:text-slate-400 text-xs 4xl:text-lg font-normal"
          >
            Season rules
          </button>
        </div>
      </div>

      <div>
        <HighScoreTable seasonId={selectedSeasonId} />
      </div>

      <Rules
        onClose={closeRules}
        visible={rulesVisible}
        seasonId={selectedSeasonId}
      />
    </div>
  );
});
SideMenu.displayName = 'SideMenu';
