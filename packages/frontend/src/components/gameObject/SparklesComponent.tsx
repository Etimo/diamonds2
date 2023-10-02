import { FC } from 'react';

export const SparklesComponent: FC = () => {
  return (
    <div className="sparkles">
      <svg id="one" width="100%" height="100%" viewBox="0 0 100 100">
        <g id="copy-1" className="group">
          <g className="large">
            <path
              id="large"
              d="M41.25,40 L42.5,10 L43.75,40 L45,41.25 L75,42.5 L45,43.75 L43.75,45 L42.5,75 L41.25,45 L40,43.75 L10,42.5 L40,41.25z"
              fill="#badbff"
            ></path>
          </g>
          <g className="large-2" transform="rotate(45)">
            <use xlinkHref="#large"></use>
          </g>
          <g className="small">
            <path
              id="small"
              d="M41.25,40 L42.5,25 L43.75,40 L45,41.25 L60,42.5 L45,43.75 L43.75,45 L42.5,60 L41.25,45 L40,43.75 L25,42.5 L40,41.25z"
              fill="white"
            ></path>
          </g>
        </g>
      </svg>
      <svg id="two" width="50%" height="50%" viewBox="0 0 100 100">
        <use xlinkHref="#copy-1"></use>
      </svg>
      <svg id="three" width="70%" height="70%" viewBox="0 0 100 100">
        <use xlinkHref="#copy-1"></use>
      </svg>
    </div>
  );
};
