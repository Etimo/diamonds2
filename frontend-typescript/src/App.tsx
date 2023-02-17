import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components';
import { Home } from './components/Home';
import { Teams } from './components/Teams';

const App: FC = () => {
  return (
    <div className="bg-white w-screen h-screen flex flex-col">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
