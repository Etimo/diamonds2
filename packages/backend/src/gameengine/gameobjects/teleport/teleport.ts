import { TeleportProperties } from "@etimo/diamonds2-types";
import { IPosition } from "../../../types/position";
import { Board } from "../../board";
import { AbstractGameObject } from "../abstract-game-object";
import { BotGameObject } from "../bot/bot";

export class TeleportGameObject extends AbstractGameObject {
  constructor(
    position: IPosition,
    private readonly _properties: TeleportProperties,
  ) {
    super(position);
  }

  get properties(): TeleportProperties {
    return this._properties;
  }

  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    const bot = gameObject as BotGameObject;
    const teleports = board.getGameObjectsByType(TeleportGameObject);
    const otherTeleport = teleports.find(
      (t) => t.properties.pairId === this.properties.pairId && t !== this,
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
