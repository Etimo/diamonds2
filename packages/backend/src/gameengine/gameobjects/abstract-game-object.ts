import { Position } from "@etimo/diamonds2-types";
import { Board } from "../board";

export abstract class AbstractGameObject {
  private positions: Position[] = [];
  private static nextId = 1;
  private readonly _id = AbstractGameObject.nextId++;

  constructor(startPosition: Position | null) {
    if (startPosition) {
      this.positions.push(startPosition);
    }
  }

  get x(): number | null {
    return this.position ? this.position.x : null;
  }

  get y(): number | null {
    return this.position ? this.position.y : null;
  }

  get id(): number {
    return this._id;
  }

  get position(): Position | null {
    if (this.positions.length > 0) {
      return { ...this.positions[this.positions.length - 1] };
    }
    return null;
  }
  set position(newPosition: Position | null) {
    if (newPosition) {
      this.positions.push(newPosition);
    } else {
      // Is this reasonable? Every getter needs a setter.
      this.clearPositions();
    }
  }

  get previousPosition() {
    return this.positions.length > 1
      ? { ...this.positions[this.positions.length - 2] }
      : null;
  }

  get properties(): object {
    return {};
  }

  public clearPositions(): void {
    this.positions = this.position === null ? [] : [this.position];
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
    if (this.position) {
      return `${this.constructor.name}(${this.position.x},${this.position.y})`;
    }
    return `${this.constructor.name}(N/A,N/A)`;
  }
}
