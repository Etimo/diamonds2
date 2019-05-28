import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
import { DummyBotGameObject } from "./dummy-bot";

export class DummyBotProvider extends AbstractGameObjectProvider {
  onBoardInitialized(board: Board) {
    const bots = [
      new DummyBotGameObject(board.getEmptyPosition()),
      new DummyBotGameObject(board.getEmptyPosition()),
    ];
    board.registerGameObjectForCallbackLoop(bots[0], 1000);
    board.addGameObjects(bots);
  }
}
