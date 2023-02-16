import React from "react";
import { useBoardIds } from "../hooks";
import Select from "../blocks/Select";

const BoardPicker = ({ onChange, value }) => {
  const ids = useBoardIds();

  return (
    <Select>
      <Select.Title>Select Board</Select.Title>
      <Select.PickerWrapper>
        <Select.Picker onChange={onChange} value={value}>
          {ids.map(id => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </Select.Picker>
      </Select.PickerWrapper>
    </Select>
  );
};

export default BoardPicker;
