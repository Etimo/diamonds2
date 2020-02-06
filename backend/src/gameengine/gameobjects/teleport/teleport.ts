import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "../../board";
import { BotGameObject } from "../bot/bot";
import { IPosition } from "../../../common/interfaces/position.interface";

export class TeleportGameObject extends AbstractGameObject {
  constructor(position: IPosition, private readonly pairId: string) {
    super(position);
  }

  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    const bot = gameObject as BotGameObject;
    const teleports = board.getGameObjectsByType(TeleportGameObject);
    const otherTeleport = teleports.find(
      t => t.pairId === this.pairId && t !== this,
    );

    if (board.trySetGameObjectPosition(bot, otherTeleport.position)) {
      board.notifyGameObjectEvent(this, "TELEPORTED");
    }
  }
}
