import { AbstractGameObject } from "../game-object";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../../board";
import { IPosition } from "src/interfaces/position.interface";

export class DiamondGameObject extends AbstractGameObject {
  toChar() {
    return this.points === 1 ? "🔹" : "🔶";
  }
  constructor(position: IPosition, private readonly points) {
    super(position);
  }

  onBotEntered(bot: IBoardBot, board: Board) {
    if (bot.diamonds + this.points <= board.getConfig().maxCarryingDiamonds) {
      bot.diamonds += this.points;
      board.removeGameObject(this);
    }
  }
}
