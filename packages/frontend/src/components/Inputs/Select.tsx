import { FC, memo } from 'react';

type SelectProps = {
  label: string;
  value: number | string;
  options: { label: string; value: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const Select: FC<SelectProps> = memo((props) => {
  const { label, value, options, onChange } = props;

  return (
    <div className="flex flex-col">
      <label className="text-label">{label}</label>
      <select
        className="border border-gray-800 rounded-md w-full max-w-[200px] h-8 p-1"
        value={value}
        onChange={onChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});
Select.displayName = 'Select';
