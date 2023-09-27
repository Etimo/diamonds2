import { FC } from 'react';

export const SparklesComponent: FC = () => {
  return (
    <div className="sparkles w-[70%] h-[70%] absolute top-1/2 left-1/2 overflow-hidden z-2">
      <div className="star text-transparent text-[0.4rem] sm:text-[0.5rem] md:text-[0.5rem] lg:text-[0.7rem] absolute">
        ✨
      </div>
    </div>
  );
};
