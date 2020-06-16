export class Board {
  constructor(id, minimumDelayBetweenMoves, height, width, gameObjects) {
    this.id = id;
    this.minimumDelayBetweenMoves = minimumDelayBetweenMoves;
    this.height = height;
    this.width = width;
    this.gameObjects = gameObjects;
  }
}
