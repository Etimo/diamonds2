import { robot1 } from './images';

export const MovingBot = () => {
  return (
    <div className="moving-image-container">
      <img src={robot1} alt="Moving bot" className="moving-image" />
    </div>
  );
};
