import { FC } from 'react';

interface CommonGameObjectProps {
  characterName?: string;
  characterImg: string;
  imageClassName?: string;
  index?: number;
}

export const CommonGameObject: FC<CommonGameObjectProps> = ({
  characterName,
  characterImg,
  imageClassName,
  index = 2,
}) => {
  return (
    <div className="flex flex-col w-full">
      {characterName && (
        <p className="text-[6px] text-black dark:text-white max-w-[98%] self-center sm:text-[10px] bg-gray-50 dark:bg-gray-800 overflow-hidden whitespace-nowrap truncate">
          {characterName}
        </p>
      )}
      <img
        src={characterImg}
        className={`w-[70%] h-[70%] self-center ${imageClassName}`}
        alt={characterName}
        style={{
          zIndex: index,
        }}
      />
    </div>
  );
};
