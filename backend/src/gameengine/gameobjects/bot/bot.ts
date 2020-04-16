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

  canGameObjectEnter(gameObject: AbstractGameObject, board: Board): boolean {
    if (gameObject instanceof BotGameObject) {
      return false;
    }
    return true;
  }
}
