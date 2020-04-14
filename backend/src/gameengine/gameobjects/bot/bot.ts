import { IPosition } from "src/common/interfaces/position.interface";
import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "src/gameengine/board";

export class BotGameObject extends AbstractGameObject {
  base: IPosition;
  diamonds: number;
  timeJoined: Date;
  expiresAt: Date;
  inventorySize: number;
  score: number;
  name: string;
  nextMoveAvailableAt: Date;

  get properties() {
    return {
      diamonds: this.diamonds,
      score: this.score,
      nextMoveAvailableAt: this.nextMoveAvailableAt,
      name: this.name,
      inventorySize: this.inventorySize,
      millisecondsLeft: this.expiresAt.getTime() - new Date().getTime(),
      timeJoined: this.timeJoined,
      base: this.base,
    };
  }

  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    if (gameObject instanceof BotGameObject) {
      const otherBot = gameObject as BotGameObject;

      // I am sent back to base
      this.position = this.base;

      // Also they steal some diamonds from me
      const canSteal = Math.min(this.diamonds, otherBot.inventorySize - otherBot.diamonds);
      this.diamonds = Math.max(this.diamonds - canSteal, 0);
      otherBot.diamonds += canSteal;
    }
  }
}
