import { Board } from "../../board.ts";
import { AbstractGameObject } from "../abstract-game-object.ts";
import { AbstractGameObjectProvider } from "../abstract-game-object-providers.ts";
import { BotGameObject } from "../bot/bot.ts";
import { BaseGameObject } from "./base.ts";

export class BaseProvider extends AbstractGameObjectProvider {
  onGameObjectsAdded(board: Board, gameObjects: AbstractGameObject[]) {
    gameObjects.forEach((gameObject) => {
      if (!(gameObject instanceof BotGameObject)) {
        return;
      }
      // Whenever a bot game object is added to the board, add a base for it
      if (!gameObject.base) {
        gameObject.base = board.getEmptyPosition();
      }
      board.addGameObjects([new BaseGameObject(gameObject)]);
    });
  }

  onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]) {
    gameObjects.forEach((gameObject) => {
      if (!(gameObject instanceof BotGameObject)) {
        return;
      }
      // Whenever a bot game object is added to the board, add a base for it
      const base = board
        .getGameObjectsByType(BaseGameObject)
        .find(
          (base) =>
            base.position.x === gameObject.base.x &&
            base.position.y === gameObject.base.y,
        );
      if (base) {
        board.removeGameObject(base);
      }
    });
  }
}
