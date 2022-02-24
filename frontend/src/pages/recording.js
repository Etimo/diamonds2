import React, { useState } from "react";
import { useLocation, useParams } from "react-router";
import Layout from "../blocks/Layout";
import GameBoard from "../components/GameBoard";
import PlayerTable from "../components/PlayerTable";
import useRecordedBoard from "../hooks/useRecordedBoard";

function useQuery() {
  const { search } = useLocation();

  return new URLSearchParams(search);
}

export default () => {
  const delay = 2000; // 0.25 s

  const data = useParams();
  const search = useQuery();
  const seasonId = data[0];
  const recordingId = search.get("recordingId");
  const [loading, rows, bots, activeBot] = useRecordedBoard(
    seasonId,
    recordingId
  );

  return (
    <Layout.Game>
      <Layout.Tables>
        {loading && <p>Loading...</p>}
        {!loading && rows && (
          <>
            <PlayerTable bots={bots} activeBot={activeBot} boardId={1} />
            <GameBoard rows={rows} activeBot={activeBot} />
          </>
        )}
      </Layout.Tables>
    </Layout.Game>
  );
};
