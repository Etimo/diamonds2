import React from 'react';
import { Grid } from './Grid';
import { SideMenu } from './SideMenu';

export const Home = () => {
  return (
    <div className="bg-white w-screen h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-[1fr_30%] px-4 pb-4">
        <Grid />
        <SideMenu />
      </div>
    </div>
  );
};
