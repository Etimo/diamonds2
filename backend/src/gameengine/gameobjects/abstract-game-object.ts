import { Board } from "../board";
import { IPosition } from "src/common/interfaces/position.interface";

export abstract class AbstractGameObject {
  private positions: IPosition[] = [];
  private static nextId = 1;
  private readonly _id = AbstractGameObject.nextId++;

  constructor(startPosition: IPosition) {
    this.position = startPosition;
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
  get position(): IPosition {
    return { ...this.positions[this.positions.length - 1] };
  }
  set position(newPosition: IPosition) {
    this.positions.push(newPosition);
  }

  get previousPosition() {
    return this.positions.length > 1
      ? { ...this.positions[this.positions.length - 2] }
      : null;
  }

  get properties(): object {
    return null;
  }

  public clearPositions(): void {
    this.positions = [this.position];
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

  toLogString(): string {
    return `${this.constructor.name}(${this.position.x},${this.position.y})`;
  }
}
