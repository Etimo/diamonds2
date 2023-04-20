import { FC, memo } from 'react';
import { useHighScore } from '../hooks/useHighScore';
import { Table } from './Table';

type HighScoreProps = {
  seasonId: string;
};

export const HighScoreTable: FC<HighScoreProps> = memo((props) => {
  const { seasonId } = props;

  const highescore = useHighScore(seasonId);
  return (
    <Table
      label="Highscore"
      cols={['Name', 'Team', 'Score']}
      data={highescore}
    />
  );
});
