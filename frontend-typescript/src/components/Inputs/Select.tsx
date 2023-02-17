import { FC, memo, useCallback, useState } from 'react';

type SelectProps = {
  label: string;
  value: number | string;
  options: number[] | string[];
  onChange: () => void;
};

export const Select: FC<SelectProps> = memo(props => {
  const { label, value, options, onChange } = props;
  const [selectedValue, setSelectedValue] = useState(value);

  const handleOnChange = useCallback(() => {
    onChange();
  }, [onChange]);

  return (
    <div className="flex flex-col">
      <label className="text-label">{label}</label>
      <select
        className="border border-gray-800 rounded-md w-full max-w-[200px] p-1"
        value={selectedValue}
        onChange={handleOnChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
});
Select.displayName = 'Select';
