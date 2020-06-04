import React from "react";
import { useSeasonNames } from "../hooks";
import Select from "../blocks/Select";

const SeasonPicker = ({ onChange, value }) => {
  const seasons = useSeasonNames();
  return (
    <Select>
      <Select.Title>Select Season</Select.Title>
      <Select.Picker onChange={onChange} value={value}>
        {seasons.map(season => (
          <option key={season} value={season}>
            {season}
          </option>
        ))}
      </Select.Picker>
    </Select>
  );
};

export default SeasonPicker;
