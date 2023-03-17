import { FC, memo } from "react";
import { Select } from "./Inputs";

const seasons: ISeason[] = [{ id: '0', name: 'Season 0' }, { id: '1', name: 'Season 1' }, { id: '2', name: 'Season 2' }];

type SeasonPickerProps = {
    seasonId: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  };

export const SeasonPicker: FC<SeasonPickerProps> = memo((props) => { 
    const { seasonId, onChange } = props;
    return ( 
        <Select
          label="Select season"
          onChange={onChange}
          options={seasons.map((season) => {return { label:season.name, value:season.id};})}
          value={seasonId}
        />
    )
});

interface ISeason {
    id: string;
    name: string;
  };