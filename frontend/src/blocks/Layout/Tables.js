import styled from "styled-components";

export default styled.div`
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
  padding: 0.5rem;
  width: 30%;

  @media only screen and (max-width: 768px) {
    min-height: 600px;
    width: 100%;
  }
`;
