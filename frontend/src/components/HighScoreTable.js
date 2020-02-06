import React from "react";
import { useFetchRepeatedly } from "../hooks";
import Table from "../blocks/Table";

const delay = 5000; // 5 sec
const url = "api/highscores";

export default () => {
  const highScores = useFetchRepeatedly(url, delay, []);

  return (
    <Table>
      <Table.Caption>Highscore</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th radiusLeft width={70}>
            Name
          </Table.Th>
          <Table.Th radiusRight>Score</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {highScores.map(bot => {
          return (
            <Table.Tr key={bot.botName}>
              <Table.Td>{bot.botName}</Table.Td>
              <Table.Td textRight>{bot.score}</Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
