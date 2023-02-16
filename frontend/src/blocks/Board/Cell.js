import styled, { css } from "styled-components";

export default styled.div`
  width: ${props => `calc(100% / ${props.width})`};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;

  ${props =>
    props.activeBot
      ? css`
          border: 1px solid blue;
        `
      : css`
          border: 1px solid #707070;
        `}

  > div {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    position: absolute;
    width: 100%;
  }

  &::after {
    content: "";
    padding-bottom: 100%;
  }
`;
