import { IBoardBot } from "src/interfaces/board-bot.interface";
import { IBoard } from "src/interfaces/board.interface";
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

  getX(): number {
    return this.position.x;
  }

  getY(): number {
    return this.position.y;
  }
}
