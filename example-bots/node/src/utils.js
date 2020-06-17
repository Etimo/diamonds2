export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function positionIsSame(obj1, obj2) {
  if (obj1.x === obj2.x && obj1.y === obj2.y) {
    return true;
  }
  return false;
}
