import styled from "styled-components";

export default styled.img`
  border-radius: 100%;
  cursor: pointer;
  height: 1.5rem;
  padding: 3px;
  position: absolute;
  right: 0;
  top: 0;
  transition: all 0.2s ease-in-out;
  width: 1.5rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
