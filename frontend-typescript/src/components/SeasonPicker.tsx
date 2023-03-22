import { FC, memo } from 'react';
import useSeasons from '../hooks/useSeasons';
import { Select } from './Inputs';

type SeasonPickerProps = {
  seasonId: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const SeasonPicker: FC<SeasonPickerProps> = memo((props) => {
  const seasons = useSeasons();
  const { seasonId, onChange } = props;
  return (
    <Select
      label="Select season"
      onChange={onChange}
      options={seasons.map((season) => {
        return { label: season.name, value: season.id };
      })}
      value={seasonId}
    />
  );
});
