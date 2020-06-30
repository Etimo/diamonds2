export const getDirection = (bot) => {
  // Returns the direction the bot should move to reach the targetPosition
  const x = bot.targetPosition.x - bot.position.x;
  if (x !== 0) {
    return moveHorizontally(x);
  }
  const y = bot.targetPosition.y - bot.position.y;
  if (y !== 0) {
    return moveVertically(y);
  }
  // We only get to this point if we have four diamonds
  // and try to fetch a Red Diamond (2 points)
  return false;
};

const moveHorizontally = (x) => {
  if (x > 0) {
    return "EAST";
  }
  return "WEST";
};

const moveVertically = (y) => {
  if (y > 0) {
    return "SOUTH";
  }
  return "NORTH";
};
