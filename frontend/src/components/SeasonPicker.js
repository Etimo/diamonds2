import React from "react";
import { useSeasons } from "../hooks";
import Select from "../blocks/Select";

const SeasonPicker = ({ onChange, value }) => {
  const seasons = useSeasons();
  return (
    <Select>
      <Select.Title>Select Season</Select.Title>
      <Select.Picker onChange={onChange} value={value}>
        {seasons.map(season => (
          <option key={season.id} value={season.id}>
            {season.name}
          </option>
        ))}
      </Select.Picker>
    </Select>
  );
};

export default SeasonPicker;
