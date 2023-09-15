import useFetch from '../hooks/useFetch';
import { useFetchRepeatedly } from '../hooks/useFetchRepeatedly';
import { HighScoreTable } from './HighScoreTable';
import { MovingBot } from './MovingBot';
import { Table } from './Table';

const url: string = 'api/teams';
const delay: number = 60000; // 1 min

export const Teams = () => {
  const teams = useFetchRepeatedly(url, delay, []) as ITeam[];
  const { response: currentSeason } = useFetch('api/seasons/current', '0');

  return (
    <>
      <div className="flex flex-col justify-center mx-auto mt-5">
        <div className="mx-4">
          <div className="mb-10">
            <Table
              label="Teams"
              cols={['Name', 'Abbreviation', 'Icon']}
              data={teams.map((team) => {
                return {
                  name: team.name,
                  abbreviation: team.abbreviation,
                  icon: <img src={team.logotypeUrl} alt="school-logo" />,
                };
              })}
            />
          </div>
          <HighScoreTable seasonId={currentSeason.id} />
        </div>
      </div>
      <div className="mt-20">
        <MovingBot />
      </div>
    </>
  );
};

interface ITeam {
  id: string;
  name: string;
  abbreviation: string;
  logotypeUrl: string;
}
