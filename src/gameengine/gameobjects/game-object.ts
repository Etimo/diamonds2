import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../board";
import { IPosition } from "src/interfaces/position.interface";

export abstract class AbstractGameObject {
  protected position: IPosition;

  constructor(position: IPosition) {
    this.position = position;
  }

  onBotEntered(bot: IBoardBot, board: Board) {}
  canBotEnter(bot: IBoardBot, board: Board): boolean {
    return true;
  }
  canBotLeave(bot: IBoardBot, board: Board): boolean {
    return true;
  }
  onBotLeft(bot: IBoardBot, board: Board) {}

  onGameObjectRemoved(board: Board) {}

  get x(): number {
    return this.position.x;
  }

  get y(): number {
    return this.position.y;
  }

  abstract toChar();
}
