import styled from "styled-components";
import Title from "./Title";
import Close from "./Close";
import RuleWrapper from "./RuleWrapper";
import Label from "./Label";
import Value from "./Value";

const Rules = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  min-width: 350px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 1rem;
  top: calc(50% - (400px / 2));
  padding: 20px;
  box-shadow: 5px 5px 10px #9e9e9e;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
`;

Rules.Title = Title;
Rules.Close = Close;
Rules.RuleWrapper = RuleWrapper;
Rules.Label = Label;
Rules.Value = Value;

export default Rules;
