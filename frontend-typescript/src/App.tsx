import { FC } from "react";
import { Grid, Header, SideMenu, Spacer } from "./components";

const App: FC = () => {
  return (
    <div className="bg-white w-screen h-screen">
      <Header />
      <div className="flex flex-row justify-between h-full">
        <Grid />
        <Spacer vertical />
        <SideMenu />
      </div>
    </div>
  );
};

export default App;
