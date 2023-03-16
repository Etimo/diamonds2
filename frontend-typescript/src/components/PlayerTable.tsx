import { FC, memo } from "react";
import { usePlayer, IPlayer } from "../hooks/usePlayer";
import { Table } from "./Table";

  type PlayerTableProps = {
    boardId: number;
  };

export const PlayerTable: FC<PlayerTableProps> = memo((props) => {
    const { boardId } = props;

    const players: IPlayer[] = usePlayer(boardId);
    return (
        <Table
          label="Board 1 Players"
          cols={['Name', 'Diamonds', 'Score', 'Time']}
          data={players}
        />
    );
});



