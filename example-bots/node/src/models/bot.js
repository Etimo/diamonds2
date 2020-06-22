import { gameEnded } from "../messages";

export class Bot {
  constructor(name, email, token) {
    this.name = name;
    this.email = email;
    this.token = token;
    this.diamonds = 0;
    this.position = { x: 0, y: 0 };
    this.base = { x: 0, y: 0 };
    this.targetPosition = null;
  }

  setBase(board) {
    board.gameObjects.forEach((go) => {
      if (go.type === "BaseGameObject" && go.properties.name === this.name) {
        this.base = go.position;
      }
    });
  }

  updateBotInfo(board) {
    const bot = board.gameObjects.find(
      (go) => go.type === "BotGameObject" && go.properties.name === this.name
    );

    if (!bot) {
      gameEnded();
    }

    this.position = bot.position;
    this.diamonds = bot.properties.diamonds;
  }
}
