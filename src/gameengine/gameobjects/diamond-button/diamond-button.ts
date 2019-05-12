import { AbstractGameObject } from "../game-object";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../../board";
import { IPosition } from "src/interfaces/position.interface";
import { DiamondGameObject } from "../diamond/diamond";

export class DiamondButtonGameObject extends AbstractGameObject {
  toChar() {
    return "☐";
  }
  onBotEntered(bot: IBoardBot, board: Board) {
    board.removeGameObjectsByType(DiamondGameObject);
  }
}
