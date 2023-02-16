import styled from "styled-components";
import Button from "./Button";
import Close from "./Close";
import Error from "./Error";
import Form from "./Form";
import Input from "./Input";
import Label from "./Label";
import Response from "./Response";
import ResponseWrapper from "./ResponseWrapper";
import Title from "./Title";

const RegisterBot = styled.div.attrs({
  className: "registerBotModal"
})`
  -webkit-transform: translateX(-50%);

  background: #fff;
  border-radius: 1rem;
  border: 1px solid #ccc;
  box-shadow: 5px 5px 10px #9e9e9e;
  display: flex;
  flex-direction: column;
  left: 50%;
  min-width: 350px;
  padding: 20px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
`;

RegisterBot.Title = Title;
RegisterBot.Close = Close;
RegisterBot.Input = Input;
RegisterBot.Label = Label;
RegisterBot.Form = Form;
RegisterBot.Button = Button;
RegisterBot.Response = Response;
RegisterBot.ResponseWrapper = ResponseWrapper;
RegisterBot.Error = Error;
// RegisterBot.RuleWrapper = RuleWrapper;
// RegisterBot.Label = Label;
// RegisterBot.Value = Value;

export default RegisterBot;
