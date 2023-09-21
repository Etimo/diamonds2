import { FC, memo } from 'react';
import { useHighScore } from '../hooks/useHighScore';
import { Table } from './Table';

type HighScoreProps = {
  seasonId: string;
};

export const HighScoreTable: FC<HighScoreProps> = memo((props) => {
  const { seasonId } = props;

  const highscore = useHighScore(seasonId);
  return (
    <Table
      label="Highscore"
      cols={['Name', 'Team', 'Score']}
      // data={highscore}
      data={highscore.map((item) => {
        return {
          name: item.botName,
          team:
            item.teamLogotype !== '' ? (
              <img src={item.teamLogotype} alt="school-logo" />
            ) : (
              item.team
            ),
          score: item.score,
        };
      })}
    />
  );
});