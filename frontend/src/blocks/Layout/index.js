import styled from "styled-components";
import Game from "./Game";
import Tables from "./Tables";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

Layout.Game = Game;
Layout.Tables = Tables;

export default Layout;
