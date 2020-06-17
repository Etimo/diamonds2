export function registrationSuccessful(bot) {
  console.log("Registration successful");
  console.log("Name: ", bot.name);
  console.log("Email: ", bot.email);
  console.log("Token: ", bot.token);
  shutDown();
}

export const registrationFailed = (name, email) => {
  console.log("Registration failed");
  console.log("Name: ", name);
  console.log("Email: ", email);
  shutDown();
};

export const invalidLogic = () => {
  console.log("Please provide a valid logic.");
  shutDown();
};

export const couldNotJoinBoard = () => {
  console.log("Could not join board");
  console.log("Bot is probably already playing on the board");
  shutDown();
};

export const botDoesNotExistOnBoard = () => {
  console.log("Shutting down!");
  shutDown();
};

export const registerInvalidParameters = () => {
  console.log("Please provide a valid name and email");
  shutDown();
};

export const playInvalidParameters = () => {
  console.log("Please provide a valid token and logic");
  shutDown();
};

export const invalidAction = () => {
  console.log("Please provide a valid action. [register, play]");
  shutDown();
};

const shutDown = () => {
  process.exit();
};
