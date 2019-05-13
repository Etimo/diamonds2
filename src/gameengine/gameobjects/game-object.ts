import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../board";
import { IPosition } from "src/interfaces/position.interface";

export abstract class AbstractGameObject {
  protected type: string = null;
  protected position: IPosition;

  constructor(position: IPosition) {
    this.position = position;
  }

  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {}
  canGameObjectEnter(gameObject: AbstractGameObject, board: Board): boolean {
    return true;
  }
  canGameObjectLeave(gameObject: AbstractGameObject, board: Board): boolean {
    return true;
  }
  onGameObjectLeft(gameObject: AbstractGameObject, board: Board) {}

  onGameObjectRemoved(board: Board) {}

  get x(): number {
    return this.position.x;
  }

  get y(): number {
    return this.position.y;
  }

  abstract toChar();
}
