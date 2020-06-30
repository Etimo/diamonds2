import styled from "styled-components";
import Logo from "./Logo";
import Title from "./Title";
import Link from "./Link";

const Header = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: baseline;
  margin: 1rem auto 2rem auto;
  height: 3rem;
  border-bottom: 1px solid #e1e1e1;

  @media only screen and (max-width: 1050px) {
    margin-bottom: 1rem;
  }
`;

Header.Logo = Logo;

Header.Title = Title;
Header.Link = Link;

export default Header;
