import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../board";
import { IPosition } from "src/common/interfaces/position.interface";

export abstract class AbstractGameObject {
  protected type: string = null;
  public position: IPosition;
  private static nextId = 1;
  private _id = AbstractGameObject.nextId++;

  constructor(position: IPosition) {
    console.log("Init", this, position)
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
  onGameObjectCallbackNotified(board: Board) {}
  onGameObjectRemoved(board: Board) {}

  get x(): number {
    return this.position.x;
  }

  get y(): number {
    return this.position.y;
  }

  get id(): number {
    return this._id;
  }

  abstract toChar();
}
