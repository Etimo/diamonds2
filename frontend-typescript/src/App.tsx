import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components';
import { Home } from './components/Home';

const App: FC = () => {
  return (
    <div className="bg-white w-screen h-screen flex flex-col">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<></>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
