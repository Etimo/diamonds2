import { FC, memo } from 'react';
import { BoardId, useBoardIds } from '../hooks/useBoardIds';
import { Select } from './Inputs';

type BoardPickerProps = {
  boardId: number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const BoardPicker: FC<BoardPickerProps> = memo((props) => {
  const { boardId, onChange } = props;
  const ids: BoardId[] = useBoardIds();

  return (
    <Select
      label="Select board"
      onChange={onChange}
      options={ids.map((id) => {
        return { label: id.toString(), value: id.toString() };
      })}
      value={boardId}
    />
  );
});
