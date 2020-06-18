export const getFirstDiamond = (bot, board) => {
  // Gets first diamond in list we can collect.
  // Example: We can't collect a 2 point diamonds if we have 4 diamonds already.
  // We will then fetch the first 1 point diamond in the list.
  const { position } = board.gameObjects.find(
    (go) =>
      go.type === "DiamondGameObject" &&
      go.properties.points <= 5 - bot.diamonds
  );
  return position;
};
