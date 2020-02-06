import React from "react";
import { useFetchRepeatedly } from "../hooks";
import Table from "../blocks/Table";

const delay = 10000; // 10 sec
const url = "api/highscores";

export default () => {
  const allSeasons = useFetchRepeatedly(url, delay, []);

  return (
    <Table>
      <Table.Caption>All Seasons</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th radiusLeft>Name</Table.Th>
          <Table.Th>Season</Table.Th>
          <Table.Th radiusRight>Score</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {allSeasons.map(bot => {
          return (
            <Table.Tr key={bot.botName}>
              <Table.Td>{bot.botName}</Table.Td>
              <Table.Td>{bot.season.name}</Table.Td>
              <Table.Td>{bot.score}</Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
