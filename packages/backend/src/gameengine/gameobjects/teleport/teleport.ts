import { IPosition } from "../../../types/position";
import { Board } from "../../board";
import { AbstractGameObject } from "../abstract-game-object";
import { BotGameObject } from "../bot/bot";

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
      (t) => t.pairId === this.pairId && t !== this,
    )!;
    if (
      bot.previousPosition?.x === otherTeleport.position.x &&
      bot.previousPosition?.y === otherTeleport.position.y
    ) {
      return;
    }
    if (board.trySetGameObjectPosition(bot, otherTeleport.position)) {
      board.notifyGameObjectEvent(this, "TELEPORTED");
    }
  }
}
