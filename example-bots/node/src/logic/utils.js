export function getDirection(bot) {
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
}

function moveHorizontally(x) {
  if (x > 0) {
    return "EAST";
  }
  return "WEST";
}

function moveVertically(y) {
  if (y > 0) {
    return "SOUTH";
  }
  return "NORTH";
}
