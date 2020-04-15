import React from "react";
import { useBoardIds } from "../hooks";
import Select from "../blocks/Select";

const BoardPicker = ({ onChange, value }) => {
  const ids = useBoardIds();

  return (
    <Select>
      <Select.Title>Select Board</Select.Title>
      <Select.Picker onChange={onChange} value={value}>
        {ids.map((id) => (
          <option value={id}>{id}</option>
        ))}
      </Select.Picker>
    </Select>
  );
};

export default BoardPicker;
