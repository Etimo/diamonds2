import { FC, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { Teams } from './components/Teams';

const App: FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`w-screen min-h-screen flex flex-col ${
        darkMode ? 'dark' : ''
      }`}
    >
      <BrowserRouter>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
