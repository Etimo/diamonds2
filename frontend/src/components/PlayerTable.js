import React from "react";
import _ from "lodash";
import { diamond } from "../images";
import Table from "../blocks/Table";

export default ({ bots }) => {
  return (
    <Table>
      <Table.Caption>Active Players</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th radiusLeft>Name</Table.Th>
          <Table.Th>Diamonds</Table.Th>
          <Table.Th>Score</Table.Th>
          <Table.Th radiusRight>Time</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {bots.map(bot => {
          return (
            <Table.Tr key={bot.name}>
              <Table.Td>{bot.name}</Table.Td>
              <Table.Td>
                {_.times(bot.diamonds, index => {
                  return <Table.Img key={index} alt="diamond" src={diamond} />;
                })}
              </Table.Td>
              <Table.Td>{bot.score}</Table.Td>
              <Table.Td>{Math.round(bot.millisecondsLeft / 1000)}s</Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
