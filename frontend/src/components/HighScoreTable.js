import React from "react";
import { useFetchRepeatedly } from "../hooks";
import Table from "../blocks/Table";

export default ({ seasonId, currentSeasonId }) => {
  if (!seasonId) return null;

  const highScores = useFetchRepeatedly(`api/highscores/${seasonId}`, 5000, []);
  const recordings = useFetchRepeatedly(`api/recordings/${seasonId}`, 5000, []);
  const isCurrentSeason = seasonId == currentSeasonId ? true : false;

  const getRecording = botName => recordings.find(r => r.botName === botName);

  return (
    <Table>
      <Table.Caption>Highscore</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th radiusLeft width={70}>
            Name
          </Table.Th>
          <Table.Th width={70}>Team</Table.Th>
          <Table.Th radiusRight>
            {isCurrentSeason ? "Score" : "Placement"}
          </Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {highScores.map((bot, index) => {
          const recording = getRecording(bot.botName);
          return (
            <Table.Tr key={index}>
              <Table.Td>
                {recording && (
                  <a
                    href={
                      "/recording/" +
                      seasonId +
                      "?recordingId=" +
                      recording.recordingId
                    }
                  >
                    {bot.botName}
                  </a>
                )}
                {!recording && bot.botName}
              </Table.Td>
              <Table.Td>
                <Table.LogoImg src={bot.teamLogotype}></Table.LogoImg>
              </Table.Td>
              <Table.Td textRight>
                {isCurrentSeason ? bot.score : index + 1}
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
