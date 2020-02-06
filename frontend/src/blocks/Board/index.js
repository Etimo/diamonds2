import styled from "styled-components";
import Row from "./Row";
import Cell from "./Cell";
import CharacterName from "./CharacterName";
import CharacterImg from "./CharacterImg";

const Board = styled.div`
  position: sticky;
  border: 1px solid #707070;
  top: 40px;
  height: 100%;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;

  @media only screen and (max-width: 1050px) {
    position: initial;
    top: initial;
  }
`;

Board.Row = Row;
Board.Cell = Cell;
Board.CharacterName = CharacterName;
Board.CharacterImg = CharacterImg;

export default Board;
