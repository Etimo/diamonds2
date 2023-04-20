import { FC, memo } from 'react';

type TableProps = {
  label?: string;
  cols: string[];
  data: any[];
};

export const Table: FC<TableProps> = memo((props) => {
  const { cols, data, label = '' } = props;
  return (
    <>
      <label className="text-label mb-2.5">{label}</label>
      <table className="w-full">
        <thead className="bg-gray-100  border-b border-b-gray-500 w-full">
          <tr className="">
            {cols.map((col, index) => (
              <th
                key={'th-' + index}
                className="font-sans text-xs text-etimo font-bold text-left p-2.5 first:rounded-tl-md last:rounded-tr-md"
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
              className="font-sans text-etimo text-xs font-normal border-b border-b-gray-500 last:border-none"
            >
              {Object.values(item).map((value: any, index2) => (
                <td
                  className="p-2.5 whitespace-nowrap min-w-[80px] first:w-[99%]"
                  key={'td' + index + index2}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
});
Table.displayName = 'Table';
