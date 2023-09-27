import { FC } from 'react';

interface CommonGameObjectProps {
  characterName?: string;
  characterImg: string;
  imageClassName?: string;
}

export const CommonGameObject: FC<CommonGameObjectProps> = ({
  characterName,
  characterImg,
  imageClassName,
}) => {
  return (
    <div className="flex flex-col w-full">
      {characterName && (
        <p className="text-[6px] text-black dark:text-white max-w-[98%] self-center sm:text-[10px] overflow-hidden whitespace-nowrap truncate">
          {characterName}
        </p>
      )}
      <img
        src={characterImg}
        className={`w-[70%] h-[70%] self-center ${imageClassName}`}
        alt={characterName}
      />
    </div>
  );
};
