import styled from "styled-components";

export default styled.div`
  border: 1px solid #707070;
  width: ${props => `calc(100% / ${props.width})`};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;

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
