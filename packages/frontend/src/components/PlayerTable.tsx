import type { BotGameObjectProperties } from "@etimo/diamonds2-types";
import { type FC, memo } from "react";
import { Table } from "./Table/index.ts";
import { diamond } from "./images/index.ts";

type PlayerTableProps = {
  bots: BotGameObjectProperties[];
  boardId: number;
};

export const PlayerTable: FC<PlayerTableProps> = memo((props) => {
  const { bots, boardId } = props;

  return (
    <Table
      label={`Board ${boardId} players`}
      cols={["Name", "Diamonds", "Score", "Time"]}
      data={bots.map(({ name, diamonds, score, millisecondsLeft }) => ({
        Name: name,
        Diamonds: (
          <div className="flex">
            {Array.from({ length: diamonds }, (_, index) => (
              <img
                className="w-[20%]"
                key={index}
                src={diamond}
                alt="diamond"
              />
            ))}
          </div>
        ),
        Score: score,
        Time: `${Math.round(millisecondsLeft / 1000)}s`,
      }))}
    />
  );
});
