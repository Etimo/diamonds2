import { IPosition } from "src/common/interfaces/position.interface";
import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "src/gameengine/board";

export interface BotGameObjectProperties {
  base: IPosition;
  diamonds: number;
  timeJoined: Date;
  inventorySize: number;
  canTackle: boolean;
  score: number;
  name: string;
  nextMoveAvailableAt: Date;
  millisecondsLeft: number;
}

export class BotGameObject extends AbstractGameObject {
  base: IPosition;
  diamonds: number;
  timeJoined: Date;
  expiresAt: Date;
  inventorySize: number;
  canTackle: boolean;
  score: number;
  name: string;
  nextMoveAvailableAt: Date;

  get properties(): BotGameObjectProperties {
    return {
      diamonds: this.diamonds,
      score: this.score,
      nextMoveAvailableAt: this.nextMoveAvailableAt,
      name: this.name,
      inventorySize: this.inventorySize,
      canTackle: this.canTackle,
      millisecondsLeft: this.expiresAt.getTime() - new Date().getTime(),
      timeJoined: this.timeJoined,
      base: this.base,
    };
  }

  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    if (gameObject instanceof BotGameObject) {
      const otherBot = gameObject as BotGameObject;

      // Return if the entering bot is not allowed to tackle (should not happen)
      if (!otherBot.canTackle) {
        return;
      }

      // I am sent back to base
      this.position = this.base;

      // Also they steal some diamonds from me
      const canSteal = Math.min(
        this.diamonds,
        otherBot.inventorySize - otherBot.diamonds,
      );
      this.diamonds = Math.max(this.diamonds - canSteal, 0);
      otherBot.diamonds += canSteal;
    }
  }
  canGameObjectEnter(gameObject: AbstractGameObject, board: Board): boolean {
    if (gameObject instanceof BotGameObject) {
      const otherBot = gameObject as BotGameObject;

      if (otherBot.canTackle) {
        return true;
      }

      if (
        otherBot.base.x === this.position.x &&
        otherBot.base.y === this.position.y
      ) {
        this.position = this.base;
        return true;
      }
    }
    return false;
  }
}
