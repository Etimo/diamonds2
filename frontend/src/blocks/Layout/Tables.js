import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 3rem;
  width: 30%;
  max-width: 450px;

  @media only screen and (max-width: 1050px) {
    width: 90%;
    max-width: initial;
    margin-left: initial;
  }
`;
