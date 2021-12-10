import styled from "styled-components";
import Logo from "./Logo";
import Title from "./Title";
import Link from "./Link";

const Header = styled.div`
  align-items: flex-end;
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  height: 3rem;
  justify-content: center;
  margin: 1rem auto;
  width: 90%;

  > div {
    flex: 1;
    display: flex;
    height: 100%;
    justify-content: center;
  }

  div:first-child > img {
    margin-right: auto;
  }
  div:last-child > div {
    display: flex;
    margin-left: auto;
    gap: 1rem;
    height: 100%;
    justify-content: right;

    a {
      display: inline-block;
      align-self: center;
    }
  }
`;

Header.Logo = Logo;

Header.Title = Title;
Header.Link = Link;

export default Header;
