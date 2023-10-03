/** istanbul ignore file */
import { Position } from "@etimo/diamonds2-types";
import { Board } from "../../board";
import { BotGameObject } from "../bot/bot";
import { DiamondGameObject } from "../diamond/diamond";
export class DummyBotGameObject extends BotGameObject {
  onGameObjectCallbackNotified(board: Board, intervalMs: number) {
    if (intervalMs === 1000) {
      // Perform a move
      const diamonds = board.getGameObjectsByType(DiamondGameObject);

      let goal: Position | null = null;
      if (diamonds.length > 0 && this.diamonds < this.inventorySize) {
        // Try to walk towards the first diamond if there is room in inventory
        goal = diamonds[0].position;
      } else if (this.diamonds === this.inventorySize) {
        // Go back to base
        goal = this.base;
      }

      if (goal) {
        const { dx, dy } = this.getDirectionTowardsGoal(goal);

        // Try updating position
        board.trySetGameObjectPosition(this, {
          x: this.position.x + dx,
          y: this.position.y + dy,
        });
      }
    } else if (intervalMs === board.getConfig().sessionLength * 1000) {
      // Session finished
      board.removeGameObject(this);
      board.unregisterGameObjectFromCallbackLoop(this, 1000);
      board.unregisterGameObjectFromCallbackLoop(
        this,
        board.getConfig().sessionLength * 1000,
      );
    }
  }

  private getDirectionTowardsGoal(goal: Position) {
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

    return { dx, dy };
  }
}
