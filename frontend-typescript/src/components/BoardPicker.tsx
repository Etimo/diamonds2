import { FC, memo } from "react";
import { Select } from "./Inputs";

const boards: IBoard[] = [{ id: 1 }, { id: 2 }, { id: 3 }];

type SeasonPickerProps = {
    boardId: number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  };

export const BoardPicker: FC<SeasonPickerProps> = memo((props) => { 
    const { boardId, onChange } = props;
    return ( 
        <Select
          label="Select board"
          onChange={onChange}
          options={boards.map((season) => {return { label: season.id.toString(), value:season.id.toString()};})}
          value={boardId}
        />
    )
});

interface IBoard {
    id: number;
  };