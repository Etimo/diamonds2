import styled from "styled-components";

export default styled.button.attrs({ className: "submitButton" })`
  padding: 0.5em 1rem;
  font-family: "PT Sans";
  font-size: 16px;
  color: white;
  background: #2c3e50;
  border-radius: 3px;
  border: none;

  &:hover {
    background-color: #273645;
  }
  &:active {
    background-color: #202c38;
    color: rgba(255, 255, 255, 0.75);
  }
`;
