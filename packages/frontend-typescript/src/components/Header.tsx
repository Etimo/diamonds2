import { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MoonIcon } from './MoonIcon';
import { SunIcon } from './SunIcon';

type HeaderProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const Header: FC<HeaderProps> = memo((props) => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = props;

  const toggleLink = (location: string) => {
    if (location.includes('teams')) {
      return <Link to="/">Game</Link>;
    }
    return <Link to="/teams">Teams</Link>;
  };

  return (
    <div className="text-header grid grid-cols-2 mx-3 my-2 lg:mx-14 lg:my-6 items-center lg:items-center border-gray-100 dark:border-slate-700 border-b-2 pb-2">
      <p className="font-bold dark:text-gray-300">Diamonds</p>
      <div className="flex justify-self-end">
        {toggleLink(location.pathname)}

        <Link
          to="https://github.com/Etimo/diamonds2"
          target="_blank"
          className="ml-3"
        >
          How to play
        </Link>

        <button onClick={toggleDarkMode} className="ml-6">
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </div>
  );
});
Header.displayName = 'Header';
