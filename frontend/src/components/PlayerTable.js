import React from "react";
import _ from "lodash";
import { DiamondGameObject1 } from "../images";
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
            <Table.Tr key={bot.properties.name}>
              <Table.Td>{bot.properties.name}</Table.Td>
              <Table.Td>
                {_.times(bot.properties.diamonds, index => {
                  return <Table.Img key={index} alt="diamond" src={DiamondGameObject1} />;
                })}
              </Table.Td>
              <Table.Td>{bot.properties.score}</Table.Td>
              <Table.Td>
                {Math.round(bot.properties.millisecondsLeft / 1000)}s
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
