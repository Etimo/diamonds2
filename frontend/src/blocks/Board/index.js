import styled from "styled-components";
import Row from "./Row";
import Cell from "./Cell";
import CharacterName from "./CharacterName";
import CharacterImg from "./CharacterImg";

const Board = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 70%;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }

  &::after {
    content: "";
    padding-bottom: 100%;
  }

  > div {
    position: absolute;
    height: 100%;
    width: 100%;
  }
`;

Board.Row = Row;
Board.Cell = Cell;
Board.CharacterName = CharacterName;
Board.CharacterImg = CharacterImg;

export default Board;
