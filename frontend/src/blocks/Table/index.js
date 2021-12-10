import styled from "styled-components";
import Caption from "./Caption";
import Thead from "./Thead";
import Tbody from "./Tbody";
import Th from "./Th";
import Tr from "./Tr";
import Td from "./Td";
import Img from "./Img";
import LogoImg from "./LogoImg";

const Table = styled.table`
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  overflow-y: scroll;
`;

Table.Caption = Caption;
Table.Thead = Thead;
Table.Tbody = Tbody;
Table.Th = Th;
Table.Tr = Tr;
Table.Td = Td;
Table.Img = Img;
Table.LogoImg = LogoImg;

export default Table;
