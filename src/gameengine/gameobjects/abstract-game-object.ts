import { Board } from "../board";
import { IPosition } from "src/common/interfaces/position.interface";

export abstract class AbstractGameObject {
  private static nextId = 1;
  private readonly _id = AbstractGameObject.nextId++;

  constructor(public position: IPosition) {
    this.position = position;
  }

  get x(): number {
    return this.position.x;
  }

  get y(): number {
    return this.position.y;
  }

  get id(): number {
    return this._id;
  }

  get properties(): object {
    return null;
  }

  canGameObjectEnter(gameObject: AbstractGameObject, board: Board): boolean {
    return true;
  }
  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {}

  canGameObjectLeave(gameObject: AbstractGameObject, board: Board): boolean {
    return true;
  }
  onGameObjectLeft(gameObject: AbstractGameObject, board: Board) {}

  onGameObjectCallbackNotified(board: Board, intervalMs: number) {}

  onGameObjectRemoved(board: Board) {}

  onEvent(
    board: Board,
    sender: AbstractGameObject,
    message: string,
    payload?: Object,
  ) {}
}
