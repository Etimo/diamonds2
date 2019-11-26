/* istanbul ignore file */
import { Board } from "../board";
import { BotGameObject } from "../gameobjects/bot/bot";

const representation = {
  BotGameObject: "Q",
  BaseGameObject: "B",
  DiamondGameObject: "X",
  DiamondButtonGameObject: "D",
  TeleportGameObject: "T",
  DummyBotGameObject: "Q",
};

const BOT_AVATARS = "🤖🦁🐙🦑🦀🐥🦞🐭🐹🐰🐶🐺🦊🐵🐸🙊🐯🦁🐮🐷🐻🐼🐲🐨";

export default function renderBoard(board: Board) {
  const cellSize = 3;
  //"┓┗┛┏┃━"
  const ret = ["┏" + "".padEnd(board.width * cellSize, "━") + "┓"];
  const allGameObjects = board.getAllGameObjects();
  for (var y = 0; y < board.height; y++) {
    const line = ["┃"];
    for (var x = 0; x < board.width; x++) {
      const gameObjects = allGameObjects.filter(g => g.x === x && g.y === y);
      var existing = gameObjects
        .map(g => representation[g.constructor.name])
        .join("")
        .padEnd(cellSize, " ");
      line.push(existing);
    }
    line.push("┃");
    ret.push(line.join(""));
  }
  ret.push("┗" + "".padEnd(board.width * cellSize, "━") + "┛");
  return ret.join("\n");
}
