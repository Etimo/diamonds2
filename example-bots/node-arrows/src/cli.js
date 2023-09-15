import arg from "arg";
import { play, register } from "./main";
import {
  invalidAction,
  playInvalidParameters,
  registerInvalidParameters,
} from "./messages";

const parseArgumentsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      "--name": String,
      "--email": String,
      "--token": String,
      "--logic": String,
      "--board": Number,
      "--password": String,
      "--team": String,
      "-n": "--name",
      "-e": "--email",
      "-t": "--token",
      "-b": "--board",
      "-l": "--logic",
      "-p": "--password",
      "-T": "--team",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    name: args["--name"] || "",
    email: args["--email"] || "",
    token: args["--token"] || "",
    logic: args["--logic"] || "",
    board: args["--board"] || 1,
    password: args["--password"] || "",
    team: args["--team"] || null,
    action: args._[0],
  };
};

export const cli = (args) => {
  const options = parseArgumentsIntoOptions(args);
  validateArgs(options);
  const { name, email, token, board, password, team, action } = options;
  switch (action) {
    case "register":
      registerBot(name, email, password, team);
      break;
    case "play":
      playGame(token, board);
      break;
    default:
      invalidAction();
  }
};

const playGame = (token, boardId) => {
  play(token, boardId);
};

const registerBot = (name, email, password, team) => {
  register(name, email, password, team);
};

const validateArgs = (options) => {
  const { name, email, token, logic, board, password, action } = options;
  if (action === "play" && token === "") {
    playInvalidParameters();
  }

  if (
    action === "register" &&
    (name === "" || email === "" || password == "" || !board)
  ) {
    registerInvalidParameters();
  }
};
