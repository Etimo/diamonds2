import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "../../../gameengine/board";
import { BotGameObject } from "../bot/bot";
import { AbstractGameObject } from "../abstract-game-object";
import { BaseGameObject } from "./base";

export class BaseProvider extends AbstractGameObjectProvider {
  onGameObjectsAdded(board: Board, gameObjects: AbstractGameObject[]) {
    gameObjects
      .filter(g => g instanceof BotGameObject)
      .forEach((bot: BotGameObject) => {
        // Whenever a bot game object is added to the board, add a base for it
        if (!bot.base) {
          bot.base = board.getEmptyPosition();
        }
        board.addGameObjects([new BaseGameObject(bot.base)]);
      });
  }

  onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]) {
    gameObjects
      .filter(g => g instanceof BotGameObject)
      .forEach((bot: BotGameObject) => {
        // Whenever a bot game object is added to the board, add a base for it
        const base = board
          .getGameObjectsByType(BaseGameObject)
          .find(
            b => b.position.x === bot.base.x && b.position.y === bot.base.y,
          );
        if (base) {
          board.removeGameObject(base);
        }
      });
  }
}
