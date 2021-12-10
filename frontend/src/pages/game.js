import React, { useState } from "react";
import { useBoard, getCurrentSeason } from "../hooks";
import Layout from "../blocks/Layout";
import GameBoard from "../components/GameBoard";
import Header from "../components/Header";
import PlayerTable from "../components/PlayerTable";
import HighScoreTable from "../components/HighScoreTable";
import BoardPicker from "../components/BoardPicker";
import SeasonPicker from "../components/SeasonPicker";
// import AllSeasonsTable from "./components/AllSeasonsTable";

export default () => {
  const currentSeason = getCurrentSeason();
  const [boardId, setBoardId] = useState(1);
  const [seasonId, setSeasonId] = useState(0);
  const delay = 2000; // 0.25 s

  const [rows, bots] = useBoard(boardId, delay);

  const onBoardChange = event => {
    setBoardId(event.target.value);
  };

  const onSeasonChange = event => {
    setSeasonId(event.target.value);
  };

  return (
    <Layout.Game>
      <GameBoard rows={rows} />
      <Layout.Tables>
        <BoardPicker value={boardId} onChange={onBoardChange} />
        <PlayerTable bots={bots} boardId={boardId} />
        <SeasonPicker
          value={seasonId ? seasonId : currentSeason.id}
          onChange={onSeasonChange}
        />
        <HighScoreTable
          seasonId={seasonId ? seasonId : currentSeason.id}
          currentSeasonId={currentSeason.id}
        />
      </Layout.Tables>
    </Layout.Game>
  );
};
