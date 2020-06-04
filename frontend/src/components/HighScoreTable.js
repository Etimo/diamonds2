import React from "react";
import { useFetchRepeatedly } from "../hooks";
import Table from "../blocks/Table";

const delay = 5000; // 5 sec
const url = "api/highscores";

export default ({ seasonId, currentSeasonId }) => {
  const highScores = useFetchRepeatedly(`${url}/${seasonId}`, delay, []);
  const isCurrentSeason = seasonId == currentSeasonId ? true : false;

  return (
    <Table>
      <Table.Caption>Highscore</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th radiusLeft width={70}>
            Name
          </Table.Th>
          <Table.Th radiusRight>
            {isCurrentSeason ? "Score" : "Placement"}
          </Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {highScores.map((bot, index) => {
          return (
            <Table.Tr key={index}>
              <Table.Td>{bot.botName}</Table.Td>
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
