import { FireProviderConfig } from "@etimo/diamonds2-types";
import { Board } from "../../board";
import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { FireGameObject } from "./fire";

export class FireProvider extends AbstractGameObjectProvider<FireProviderConfig> {
  constructor(config: FireProviderConfig) {
    super(config);
  }

  onBoardInitialized(board: Board) {
    this.generateFires(board);
  }

  private generateFires(board: Board) {
    const gameObjectsToAdd = [];
    for (let i = 0; i < this.config.fireCells; i++) {
      gameObjectsToAdd.push(
        new FireGameObject(board.getEmptyPosition(), { takeDiamonds: true }),
      );
    }
    board.addGameObjects(gameObjectsToAdd);
  }
}
