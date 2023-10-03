import { Position } from "@etimo/diamonds2-types";
import { Board } from "../board";

export abstract class AbstractGameObject {
  private positions: Position[] = [];
  private static nextId = 1;
  private readonly _id = AbstractGameObject.nextId++;

  constructor(startPosition: Position) {
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
  get position(): Position {
    return { ...this.positions[this.positions.length - 1] };
  }
  set position(newPosition: Position) {
    this.positions.push(newPosition);
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
