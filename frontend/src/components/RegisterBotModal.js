import React, { useCallback, useState } from "react";
import RegisterBot from "../blocks/RegisterBot";
import { usePost } from "../hooks";
import { close } from "../images";

const RegisterBotModal = ({ visible, setVisible }) => {
  const style = {
    position: "relative"
  };
  const { post, isLoading, error } = usePost("/api/bots");
  const [response, setResponse] = useState(null);

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    const submit = async e => {
      const values = {
        email: e.target.email.value,
        botName: e.target.name.value,
        password: e.target.password.value,
        ...(e.target.team.value.length && {
          team: e.target.team.value
        })
      };

      const response = await post(values);
      if (response) {
        setResponse(response.data.data);
      }
    };
    submit(event);
  });

  return (
    visible && (
      <RegisterBot>
        <div style={style}>
          <RegisterBot.Title>
            {response ? "Registration Successful" : "Register Bot"}
          </RegisterBot.Title>
          {response ? (
            <RegisterBot.ResponseWrapper>
              <RegisterBot.Label>Token</RegisterBot.Label>
              <RegisterBot.Response>{response.token}</RegisterBot.Response>
              <RegisterBot.Label>
                Use this token to controll your bot
              </RegisterBot.Label>
            </RegisterBot.ResponseWrapper>
          ) : (
            <RegisterBot.Form onSubmit={handleSubmit}>
              <RegisterBot.Label>E-mail *</RegisterBot.Label>
              <RegisterBot.Input name="email" type="email" required />
              <RegisterBot.Label>Password *</RegisterBot.Label>
              <RegisterBot.Input name="password" type="password" required />
              <RegisterBot.Label>Bot name *</RegisterBot.Label>
              <RegisterBot.Input name="name" required />
              <RegisterBot.Label>Team</RegisterBot.Label>
              <RegisterBot.Input name="team" />
              <RegisterBot.Button type="submit" disabled={isLoading}>
                Submit
              </RegisterBot.Button>
              {error && <RegisterBot.Error>{error.message}</RegisterBot.Error>}
            </RegisterBot.Form>
          )}
          <RegisterBot.Close
            alt="close"
            src={close}
            onClick={() => {
              setVisible(false);
              setResponse(null);
            }}
          />
        </div>
      </RegisterBot>
    )
  );
};

export default RegisterBotModal;
