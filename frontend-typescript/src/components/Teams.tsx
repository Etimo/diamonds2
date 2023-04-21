import { useFetchRepeatedly } from '../hooks/useFetchRepeatedly';
import { Table } from './Table';

const url: string = 'api/teams';
const delay: number = 60000; // 1 min

export const Teams = () => {
  const teams = useFetchRepeatedly(url, delay, []) as ITeam[];
  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <Table
          label="Teams"
          cols={['Name', 'Abbreviation', 'Icon']}
          data={teams.map((team) => {
            return {
              name: team.name,
              abbreviation: team.abbreviation,
              icon: <img src={team.logotypeUrl} alt="school-logo"></img>,
            };
          })}
        />
      </div>
    </div>
  );
};

interface ITeam {
  id: string;
  name: string;
  abbreviation: string;
  logotypeUrl: string;
}
