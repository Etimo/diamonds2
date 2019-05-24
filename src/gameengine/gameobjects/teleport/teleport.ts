import { AbstractGameObject } from "../abstract-game-object";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../../board";
import { IPosition } from "src/common/interfaces/position.interface";
import { BotGameObject } from "../bot/bot";

export class TeleportGameObject extends AbstractGameObject {
  protected type: string = "teleport";

  toChar() {
    return "O";
  }

  constructor(position: IPosition, private readonly pairId: string) {
    super(position);
  }

  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    const bot = gameObject as BotGameObject;
    const teleports = board.getGameObjectsByType(TeleportGameObject);
    const otherTeleport = teleports.find(
      t => t.pairId === this.pairId && t !== this,
    );

    // Will cause max call stack exceeded since the other teleport will immediately change position back to here
    //otherTeleport.position
    if (board.trySetGameObjectPosition(bot, {x: 0, y: 0})) {
      board.notifyGameObjectEvent(this, "TELEPORTED");
    }

  }
}
