export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const positionIsSame = (pos1, pos2) => {
  if (pos1.x === pos2.x && pos1.y === pos2.y) {
    return true;
  }
  return false;
};
