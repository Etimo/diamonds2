import { robot } from "./images/index.ts";

export const MovingBot = () => {
  return (
    <div className="moving-image-container">
      <img src={robot} alt="Moving bot" className="moving-image" />
    </div>
  );
};
