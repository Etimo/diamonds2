import styled from "styled-components";
import Caption from "./Caption";
import Thead from "./Thead";
import Tbody from "./Tbody";
import Th from "./Th";
import Tr from "./Tr";
import Td from "./Td";
import Img from "./Img";

const Table = styled.table`
  border-collapse: collapse;
  margin-bottom: 1.5rem;
`;

Table.Caption = Caption;
Table.Thead = Thead;
Table.Tbody = Tbody;
Table.Th = Th;
Table.Tr = Tr;
Table.Td = Td;
Table.Img = Img;

export default Table;
