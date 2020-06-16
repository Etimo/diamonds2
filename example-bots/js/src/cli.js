import arg from "arg";
import { register, play } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--name": String,
      "--email": String,
      "--token": String,
      "-n": "--name",
      "-e": "--email",
      "-t": "--token"
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    name: args["--name"] || "",
    email: args["--email"] || "",
    token: args["--token"] || "",
    action: args._[0]
  };
}

export function cli(args) {
  const options = parseArgumentsIntoOptions(args);

  console.log(options);
  validateArgs(options);
  const { name, email, token, action } = options;
  switch (action) {
    case "register":
      registerBot(name, email);
      break;
    case "play":
      playGame(token);
      break;
    default:
      shutDown("Please provide a valid action. [register, play]");
  }
}

function playGame(token) {
  try {
    play(token);
  } catch (error) {}
}

function registerBot(name, email) {
  try {
    register(name, email);
  } catch (error) {}
}

function validateArgs(options) {
  const { name, email, token, action } = options;
  if (action === "play" && token === "") {
    shutDown("Please provide a valid token");
  }

  if (action === "register" && (name === "" || email === "")) {
    shutDown("Please provide a valid name and email");
  }
}

function shutDown(errorMessage) {
  console.log(errorMessage);
  process.exit();
}
