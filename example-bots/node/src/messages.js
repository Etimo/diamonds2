export function registrationSuccessful(bot) {
  console.log("Registration successful");
  console.log("Name: ", bot.name);
  console.log("Email: ", bot.email);
  console.log("Token: ", bot.token);
  shutDown();
}

export function registrationFailed(name, email) {
  console.log("Registration failed");
  console.log("Name: ", name);
  console.log("Email: ", email);
  shutDown();
}

export function invalidLogic() {
  console.log("Please provide a valid logic.");
  shutDown();
}

export function couldNotJoinBoard() {
  console.log("Could not join board");
  console.log("Bot is probably already playing on the board");
  shutDown();
}

export function botDoesNotExistOnBoard() {
  console.log("Shutting down!");
  shutDown();
}

function shutDown() {
  process.exit();
}
