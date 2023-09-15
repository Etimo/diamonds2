import { Link } from 'react-router-dom';
import etimoLogo from '../assets/etimoLogo.png';

export const Footer = () => {
  return (
    <div className="dark:bg-gray-800 pt-[2rem] 2xl:pt-[3rem] pb-8 w-full flex justify-center items-center sticky top-[100vh]">
      <h1>Powered by</h1>
      <div className="w-[100px] ml-5">
        <Link to="https://etimo.se/" target="_blank">
          <img src={etimoLogo} alt="etimo-logo" />
        </Link>
      </div>
    </div>
  );
};
