import React from "react";
import { useFetchRepeatedly } from "../hooks";
import Table from "../blocks/Table";

const delay = 10000; // 10 sec
const url = "api/teams";

export default () => {
  const teams = useFetchRepeatedly(url, delay, []);

  return (
    <Table>
      <Table.Caption>Teams</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th radiusLeft width={70}>
            Name
          </Table.Th>
          <Table.Th width={70}>Abbreviation</Table.Th>
          <Table.Th radiusRight width={70}>
            Icon
          </Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {teams.map(team => {
          return (
            <Table.Tr key={team.name}>
              <Table.Td>{team.name}</Table.Td>
              <Table.Td>{team.abbreviation}</Table.Td>
              <Table.Td>
                <Table.LogoImg src={team.logotypeUrl}></Table.LogoImg>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
