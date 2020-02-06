import styled, { css } from "styled-components";

export default styled.th`
  padding: 10px;
  text-align: left;
  font-size: 0.8em;
  font-weight: 600;
  background-color: #ecf0f1;
  color: #3d3d3d;
  border-bottom: 1px solid #adadad;


  ${props =>
    props.width &&
    css`
      width: ${props.width}%;
    `}

  ${props =>
    props.radiusLeft &&
    css`
      border-radius: 4px 0 0 0;
    `}
  ${props =>
    props.radiusRight &&
    css`
      border-radius: 0 4px 0 0;
    `}
`;
