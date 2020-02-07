/** istanbul ignore file */
import { BotGameObject } from "../bot/bot";
import { Board } from "src/gameengine/board";
import { DiamondGameObject } from "../diamond/diamond";

export class DummyBotGameObject extends BotGameObject {
  onGameObjectCallbackNotified(board: Board, intervalMs: number) {
    const diamonds = board.getGameObjectsByType(DiamondGameObject);
    if (diamonds.length > 0) {
      const goal = diamonds[0];
      let dx = goal.x - this.position.x;
      let dy = goal.y - this.position.y;
      if (dx != 0) {
        dy = 0;
      }

      // Clamp values to [-1, 1]
      if (dx != 0) {
        dx = dx / Math.abs(dx);
      }
      if (dy != 0) {
        dy = dy / Math.abs(dy);
      }

      // Try updating position
      board.trySetGameObjectPosition(this, {
        x: this.position.x + dx,
        y: this.position.y + dy,
      });
    }
  }
}
