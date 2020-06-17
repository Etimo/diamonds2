export const getFirstDiamond = (bot, board) => {
  const { position } = board.gameObjects.find(
    (go) =>
      go.type === "DiamondGameObject" &&
      go.properties.points <= 5 - bot.diamonds
  );
  return position;
};
