import { FC, memo } from 'react';

type TalbeProps = {
  cols: string[];
  data: any[];
};

export const Table: FC<TalbeProps> = memo(props => {
  const { cols, data } = props;
  return (
    <table className="w-full">
      <thead className="bg-gray-100 w-full">
        <tr className="">
          {cols.map((col, index) => (
            <th
              key={'th-' + index}
              className="font-sans text-xs text-etimo font-semibold text-left p-2.5 first:rounded-tl-md last:rounded-tr-md"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={'tr-' + index}
            className="font-sans text-lg text-etimo font-normal border-b border-b-gray-400 last:border-none"
          >
            <td className="p-2.5">{item.name}</td>
            <td className="p-2.5">{item.diamonds}</td>
            <td className="p-2.5">{item.score}</td>
            <td className="p-2.5">{item.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
Table.displayName = 'Table';
