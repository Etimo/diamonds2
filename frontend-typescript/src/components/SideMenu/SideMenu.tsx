import { FC, memo } from 'react';
import { Select } from '../Inputs';
import { CurrentBoardPlayers } from './CurrentBoardPlayers';

export const SideMenu: FC = memo(() => {
  return (
    <div className="border border-gray-400 rounded-xl overflow-y-scroll flex flex-col p-4">
      <div className="mb-6">
        <Select onChange={() => {}} options={[]} value={''} />
      </div>
      <CurrentBoardPlayers />
    </div>
  );
});
SideMenu.displayName = 'SideMenu';
