import { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import etimoLogo from '../assets/etimoLogo.png';

export const Header: FC = memo(() => {
  const location = useLocation();

  const toggleLink = (location: string) => {
    if (location.includes('teams')) {
      return <Link to="/">Game</Link>;
    }
    return <Link to="/teams">Teams</Link>;
  };

  return (
    <div className="text-header grid grid-cols-[70px,1fr,2fr] lg:grid-cols-3 mx-3 my-2 lg:mx-14 lg:my-6 items-center lg:items-baseline border-b-2 pb-2">
      <div className="w-full lg:w-1/3">
        <img src={etimoLogo} alt="etimo-logo" />
      </div>
      <p className="justify-self-center font-bold">Diamonds</p>
      <div className="justify-self-end font-bold">
        {toggleLink(location.pathname)}

        <Link
          to="https://github.com/Etimo/diamonds2"
          target="_blank"
          className="ml-3"
        >
          How to play
        </Link>
      </div>
    </div>
  );
});
Header.displayName = 'Header';
