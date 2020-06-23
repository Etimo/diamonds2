import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "../../board";
import { BotGameObject } from "../bot/bot";
import { IPosition } from "../../../common/interfaces/position.interface";

export interface TeleportGameObjectProperties {
  pairId: string;
}

export class TeleportGameObject extends AbstractGameObject {
  constructor(position: IPosition, private readonly pairId: string) {
    super(position);
  }

  get properties(): TeleportGameObjectProperties {
    return {
      pairId: this.pairId,
    };
  }

  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    const bot = gameObject as BotGameObject;
    const teleports = board.getGameObjectsByType(TeleportGameObject);
    const otherTeleport = teleports.find(
      t => t.pairId === this.pairId && t !== this,
    );
    if (
      bot.previousPosition.x === otherTeleport.position.x &&
      bot.previousPosition.y === otherTeleport.position.y
    ) {
      return;
    }
    if (board.trySetGameObjectPosition(bot, otherTeleport.position)) {
      board.notifyGameObjectEvent(this, "TELEPORTED");
    }
  }
}
