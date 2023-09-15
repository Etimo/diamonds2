import { GameObject } from "./gameObject";

export class Board {
  constructor(id, minimumDelayBetweenMoves, height, width, gameObjects) {
    this.id = id;
    this.minimumDelayBetweenMoves = minimumDelayBetweenMoves;
    this.height = height;
    this.width = width;
    this.gameObjects = gameObjects;
  }

  static dataToBoard({
    id,
    minimumDelayBetweenMoves,
    height,
    width,
    gameObjects,
  }) {
    return new Board(
      id,
      minimumDelayBetweenMoves,
      height,
      width,
      GameObject.dataToListOfGameObjects(gameObjects)
    );
  }
}
