import styled, { keyframes, css } from "styled-components";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export default styled.img`
  width: 75%;

  ${props =>
    props.rotate &&
    css`
      animation: ${spin} 10s infinite;
      animation-timing-function: linear;
    `}
`;
