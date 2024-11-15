import { IHighscoreDto } from "@etimo/diamonds2-types";
import { FC, memo } from "react";
import { useHighScore } from "../hooks/useHighScore.ts";
import { Spinner } from "./Spinner.tsx";
import { Table } from "./Table/index.ts";

type HighScoreProps = {
  seasonId: string;
};
export const HighScoreTable: FC<HighScoreProps> = memo((props) => {
  const { seasonId } = props;

  const logotype = (item: IHighscoreDto) => {
    if (item.teamLogotype) {
      return <img src={item.teamLogotype} alt="school-logo" />;
    }
    if (item.team) {
      return item.team;
    }
    return "";
  };

  if (!seasonId) {
    return <Spinner />;
  }
  const highscore = useHighScore(seasonId);
  return (
    <Table
      label="Highscore"
      cols={["Name", "Team", "Score"]}
      data={highscore.map((item) => {
        return {
          name: item.botName,
          team: logotype(item),
          score: item.score,
        };
      })}
    />
  );
});
