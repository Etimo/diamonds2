import { FC, memo } from 'react';

type SpacerProps = {
  vertical?: boolean;
};

export const Spacer: FC<SpacerProps> = memo(({ vertical = false }) => {
  return vertical ? <div className="w-[1px] bg-black h-full" /> : <hr />;
});
Spacer.displayName = 'Spacer';
