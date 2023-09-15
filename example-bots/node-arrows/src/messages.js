import chalk from "chalk";

export function registrationSuccessful(bot) {
  console.log(chalk.green("Registration successful"));
  console.log(chalk.blue("Name: ", bot.name));
  console.log(chalk.blue("Email: ", bot.email));
  console.log(chalk.blue("Token: ", bot.token));
  shutDown();
}

export const registrationFailed = (name, email) => {
  console.log(chalk.red("Registration failed"));
  console.log(chalk.blue("Name: ", name));
  console.log(chalk.blue("Email: ", email));
  shutDown();
};

export const invalidLogic = () => {
  console.log(chalk.red("Please provide a valid logic."));
  shutDown();
};

export const couldNotJoinBoard = () => {
  console.log(chalk.red("Could not join board"));
  shutDown();
};

export const registerInvalidParameters = () => {
  console.log(chalk.red("Please provide a valid name, email and password"));
  shutDown();
};

export const playInvalidParameters = () => {
  console.log(chalk.red("Please provide a valid token and logic"));
  shutDown();
};

export const invalidAction = () => {
  console.log(chalk.red("Please provide a valid action. [register, play]"));
  shutDown();
};

export const gameStarted = () => {
  console.log(chalk.blue("Bot joined game!"));
};

export const gameEnded = () => {
  console.log(chalk.blue("Bot left game!"));
};

const shutDown = () => {
  process.exit();
};
