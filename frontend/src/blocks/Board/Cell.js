import styled from "styled-components";

export default styled.div`
  border: 1px solid #707070;
  width: ${props => `${props.smallCellSize}vw`};
  height: ${props => `${props.smallCellSize}vw`};
  display: flex;
  max-width: 3.5vw;
  max-height: 3.5vw;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;

  @media only screen and (max-width: 1050px) {
    max-width: initial;
    max-height: initial;
    width: ${props => `${props.bigCellSize}vw`};
    height: ${props => `${props.bigCellSize}vw`};
  }
`;
