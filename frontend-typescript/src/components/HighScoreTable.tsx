import { FC, memo } from "react";
import { Table } from "./Table";
import { useHighScore, IHighScore } from "../hooks/useHighScore";

  type HighScoreProps = {
    seasonId: string;
  };

export const HighScoreTable: FC<HighScoreProps> = memo((props) => {
    const { seasonId } = props;
    const highescore: IHighScore[] = useHighScore(seasonId);
    return (
        <Table
          label="Highscore"
          cols={['Name', 'Team', 'Score']}
          data={highescore}
        />
    );
});

