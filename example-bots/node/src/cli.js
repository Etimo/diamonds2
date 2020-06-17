import arg from "arg";
import { register, play } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--name": String,
      "--email": String,
      "--token": String,
      "--logic": String,
      "-n": "--name",
      "-e": "--email",
      "-t": "--token",
      "-l": "--logic",
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
    action: args._[0],
  };
}

export function cli(args) {
  const options = parseArgumentsIntoOptions(args);

  console.log(options);
  validateArgs(options);
  const { name, email, token, logic, action } = options;
  switch (action) {
    case "register":
      registerBot(name, email);
      break;
    case "play":
      playGame(token, logic);
      break;
    default:
      shutDown("Please provide a valid action. [register, play]");
  }
}

function playGame(token, logic) {
  try {
    play(token, logic);
  } catch (error) {}
}

function registerBot(name, email) {
  try {
    register(name, email);
  } catch (error) {}
}

function validateArgs(options) {
  const { name, email, token, logic, action } = options;
  if (action === "play" && (token === "" || logic == "")) {
    shutDown("Please provide a valid token and logic");
  }

  if (action === "register" && (name === "" || email === "")) {
    shutDown("Please provide a valid name and email");
  }
}

function shutDown(errorMessage) {
  console.log(errorMessage);
  process.exit();
}
