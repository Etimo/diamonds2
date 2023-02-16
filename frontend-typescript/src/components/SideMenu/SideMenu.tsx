import { FC, memo } from 'react';

export const SideMenu: FC = memo(() => {
  return (
    <div className="border border-gray-400 rounded-xl overflow-y-scroll">
      SideMenu
    </div>
  );
});
SideMenu.displayName = 'SideMenu';
