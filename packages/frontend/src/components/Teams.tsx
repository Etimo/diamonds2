import { ISeasonDto } from '@etimo/diamonds2-types';
import useFetch from '../hooks/useFetch';
import useTeams from '../hooks/useTeams';
import { HighScoreTable } from './HighScoreTable';
import { MovingBot } from './MovingBot';
import { Table } from './Table';

export const Teams = () => {
  const teams = useTeams();
  const { response: currentSeason } = useFetch('api/seasons/current', '0') as {
    response: ISeasonDto;
  };

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
