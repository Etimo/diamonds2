import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
import { AbstractGameObject } from "../abstract-game-object";
import { TeleportGameObject } from "./teleport";

export class TeleportProvider extends AbstractGameObjectProvider {
  onBoardInitialized(board: Board) {
    this.generateTeleports(board);
  }

  private generateTeleports(board: Board) {
    const pairId = "1";
    board.addGameObjects([
      new TeleportGameObject(board.getEmptyPosition(), pairId),
      new TeleportGameObject(board.getEmptyPosition(), pairId),
    ]);
  }
}
