import { FC } from 'react';
import { Grid, Header, SideMenu } from './components';

const App: FC = () => {
  return (
    <div className="bg-white w-screen h-screen flex flex-col">
      <Header />
      <div className="flex-1 grid grid-cols-[1fr_30%]">
        <Grid />
        <SideMenu />
      </div>
    </div>
  );
};

export default App;
