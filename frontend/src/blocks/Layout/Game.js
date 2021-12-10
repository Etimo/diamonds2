import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  height: calc(100% - 5rem);
  justify-content: space-around;
  padding: 0 1rem 1.5rem;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;
