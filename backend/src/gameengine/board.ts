import { IBot } from "src/interfaces/bot.interface";
import { IPosition } from "../common/interfaces/position.interface";
import { BoardConfig } from "./board-config";
import { AbstractGameObject } from "./gameobjects/abstract-game-object";
import { AbstractGameObjectProvider } from "./gameobjects/abstract-game-object-providers";
import { BotGameObject } from "./gameobjects/bot/bot";

export class Board {
  private static nextId = 1;
  private readonly _id: number = Board.nextId++;
  private bots: Object = {};
  private gameObjects: AbstractGameObject[] = [];
  public readonly maxNumberOfCarryingDiamonds: number = 5;
  private callbackLoopsRegistered = {};
  private callbackLoopsId = {};
  private botMoves = {};
  highscoreCallback;

  constructor(
    public config: BoardConfig,
    public gameObjectProviders: AbstractGameObjectProvider[],
    protected logger: any,
  ) {
    this.notifyProvidersBoardInitialized();
  }

  getId(): number {
    return this._id;
  }

  registerSessionFinishedCallback(callback: Function) {
    this.highscoreCallback = callback;
  }

  async join(bot: IBot) {
    // Add bot to board
    this.bots[bot.token] = bot;

    // Create expiration timer
    this.createNewExpirationTimer(bot);
    // ...and notify all providers
    this.notifyProvidersBoardBotJoined(bot);

    return true;
  }

  getBot(token: string): IBot {
    return this.bots[token];
  }

  public async move(bot: IBot, delta: IPosition) {
    const botGameObject = this.getGameObjectsByType(BotGameObject).find(
      b => b.name === bot.name,
    );

    if (botGameObject) {
      const position = botGameObject.position;
      position.x = position.x + delta.x;
      position.y = position.y + delta.y;
      return this.trySetGameObjectPosition(botGameObject, position);
    }
    return false;
  }

  private createNewExpirationTimer(bot: IBot) {
    const id = setTimeout(_ => {
      // TODO: add lock
      this.logger.debug(`Purge bot ${bot.name}`);
      const botGameObject = this.getGameObjectsByType(BotGameObject).find(
        b => b.name === bot.name,
      );
      if (!botGameObject) {
        return;
      }

      this.removeGameObject(botGameObject);
      if (this.highscoreCallback) {
        this.highscoreCallback(botGameObject.name, botGameObject.score);
      }
    }, this.config.sessionLength * 1000);
    return id;
  }

  isCellEmpty(x: number, y: number): boolean {
    return !this.gameObjects.some(g => g.x === x && g.y === y);
  }

  registerGameObjectForCallbackLoop(
    gameObject: AbstractGameObject,
    interval: number,
  ) {
    if (!(interval in this.callbackLoopsRegistered)) {
      // Setup new interval in callbackloops
      const id = setInterval(_ => {
        // TODO: add lock
        this.logger.debug(`Callback loop triggered for interval ${interval}`);
        this.callbackLoopsRegistered[
          interval
        ].forEach((g: AbstractGameObject) =>
          g.onGameObjectCallbackNotified(this, interval),
        );
      }, interval);
      this.callbackLoopsRegistered[interval] = [gameObject];
      this.callbackLoopsId[interval] = id;
    } else {
      this.callbackLoopsRegistered[interval].push(gameObject);
    }
  }

  unregisterGameObjectFromCallbackLoop(
    gameObject: AbstractGameObject,
    interval: number,
  ) {
    if (interval in this.callbackLoopsRegistered) {
      // Remove from collection
      this.callbackLoopsRegistered[interval] = this.callbackLoopsRegistered[
        interval
      ].filter(g => g != gameObject);

      // TODO: Stop interval timer if empty?
      if (this.callbackLoopsRegistered[interval].length === 0) {
      }
    }
  }

  /**
   * Returns a random position on the board that is considered empty. By empty, it means that there are
   * no game objects on the cell.
   *
   * @returns IPosition
   */
  getEmptyPosition(): IPosition {
    // Try random positions for some time
    for (var i = 0; i < this.config.width * this.config.height; i++) {
      const { x, y } = this.getRandomPosition();
      if (this.isCellEmpty(x, y)) {
        return { x, y };
      }
    }

    // If not found, try more systematic so we dont get stuck in an endless loop
    for (var i = 0; i < this.config.width * this.config.height; i++) {
      const x = i % this.config.width;
      const y = Math.floor(i / this.config.height);
      if (this.isCellEmpty(x, y)) {
        return { x, y };
      }
    }

    return null;
  }

  /**
   * Returns a random position on the board.
   */
  getRandomPosition(): IPosition {
    return {
      x: Math.floor(Math.random() * this.config.width),
      y: Math.floor(Math.random() * this.config.height),
    };
  }

  getConfig(): BoardConfig {
    return this.config;
  }

  get width() {
    return this.config.width;
  }

  get height() {
    return this.config.height;
  }

  getAllGameObjects(): AbstractGameObject[] {
    return this.gameObjects;
  }

  addGameObjects(gameObjects: AbstractGameObject[]) {
    this.gameObjects.push(...gameObjects);
    this.notifyProvidersGameObjectsAdded(gameObjects);
  }

  getGameObjectOnPosition(p: IPosition): AbstractGameObject[] {
    return this.gameObjects.filter(g => g.x === p.x && g.y === p.y);
  }

  trySetGameObjectPosition(
    gameObject: AbstractGameObject,
    dest: IPosition,
    skipLeaveCheck = false,
    skipEnterCheck = false,
  ): boolean {
    // Check if the moving object already been here during this request
    if (gameObject.hasAlreadyBeenHere(dest)) {
      this.gameObjects.forEach(o => o.clearPositions());
      return false;
    }

    // Check if we can leave the current position
    if (!(skipLeaveCheck || this.canGameObjectLeave(gameObject, dest))) {
      this.logger.debug("Not allowed to leave");
      return false;
    }

    // Check if we can enter the new position
    if (
      this.destinationIsOutOfBounds(dest) ||
      !(skipEnterCheck || this.canGameObjectEnter(gameObject, dest))
    ) {
      this.logger.debug("Not allowed to enter");
      return false;
    }

    // Notfy game objects in current position that we are leaving to the new position
    const gameObjectsPrev = this.getGameObjectOnPosition(gameObject.position);
    this.logger.debug(
      JSON.stringify(gameObject),
      "left",
      JSON.stringify(gameObject.position),
    );
    gameObjectsPrev.forEach(g => g.onGameObjectLeft(gameObject, this));

    // Update position of game object
    gameObject.position = dest;

    // Notify game objects in new position that we are entering the new position
    const gameObjectsDest = this.getGameObjectOnPosition(dest);
    this.logger.debug(
      JSON.stringify(gameObject),
      "entered",
      JSON.stringify(gameObject.position),
    );
    gameObjectsDest.forEach(g => g.onGameObjectEntered(gameObject, this));

    return true;
  }

  canGameObjectEnter(gameObject: AbstractGameObject, dest: IPosition): boolean {
    const gameObjects = this.getGameObjectOnPosition(dest);
    return !gameObjects.some(g => !g.canGameObjectEnter(gameObject, this));
  }

  canGameObjectLeave(gameObject: AbstractGameObject, dest: IPosition): boolean {
    const gameObjects = this.getGameObjectOnPosition(dest);
    return !gameObjects.some(g => !g.canGameObjectLeave(gameObject, this));
  }

  /**
   * Get an array of all game objects matching the given type T.
   *
   * @returns T[] Array of game objects.
   */
  getGameObjectsByType<T extends AbstractGameObject>(
    t: new (...args: any[]) => T,
  ): T[] {
    return this.gameObjects.filter(g => g instanceof t).map(g => g as T);
  }

  /**
   * Remove a specific game object from the board.
   *
   * @param gameObject The game object to remove.
   */
  removeGameObject(gameObject: AbstractGameObject) {
    gameObject.onGameObjectRemoved(this);
    this.gameObjects = this.gameObjects.filter(g => g !== gameObject);
    this.notifyProvidersGameObjectsRemoved([gameObject]);
  }

  /**
   * Remove all game objects of type T from the board.
   */
  removeGameObjectsByType<T extends AbstractGameObject>(
    t: new (...args: any[]) => T,
  ) {
    this.gameObjects.forEach(g => g.onGameObjectRemoved(this));
    const removed = this.gameObjects.filter(g => !(g instanceof t));
    this.gameObjects = this.gameObjects.filter(g => g instanceof t);
    this.notifyProvidersGameObjectsRemoved(removed);
  }

  private notifyProvidersGameObjectsRemoved(gameObjects: AbstractGameObject[]) {
    this.logger.debug(
      `notifyProvidersGameObjectsRemoved ${this.getLogString(gameObjects)}`,
    );
    this.gameObjectProviders.forEach(p =>
      p.onGameObjectsRemoved(this, gameObjects),
    );
  }

  getLogString(gameObjects: AbstractGameObject[]): string {
    return JSON.stringify(gameObjects.map(g => g.toLogString()));
  }

  private notifyProvidersGameObjectsAdded(gameObjects: AbstractGameObject[]) {
    this.logger.debug(
      `notifyProvidersGameObjectsAdded ${this.getLogString(gameObjects)}`,
    );
    this.gameObjectProviders.forEach(p =>
      p.onGameObjectsAdded(this, gameObjects),
    );
  }

  private notifyProvidersBoardInitialized() {
    this.logger.debug("notifyProvidersBoardInitialized");
    this.gameObjectProviders.forEach(p => p.onBoardInitialized(this));
  }

  private notifyProvidersBoardBotJoined(bot: IBot) {
    this.gameObjectProviders.forEach(p => p.onBotJoined(bot, this));
  }

  private destinationIsOutOfBounds(destination: IPosition): boolean {
    const outOfX = destination.x < 0 || destination.x >= this.width;
    const outOfY = destination.y < 0 || destination.y >= this.height;
    return outOfX || outOfY;
  }

  getLastMove(bot: IBot) {
    return this.botMoves[bot.name];
  }

  updateLastMove(bot: IBot) {
    this.botMoves[bot.name] = Date.now();
  }

  notifyGameObjectEvent(
    sender: AbstractGameObject,
    message: string,
    payload?: Object,
  ) {
    this.logger.debug(
      "notifyGameObjectEvent",
      JSON.stringify(sender),
      message,
      JSON.stringify(payload),
    );
    this.gameObjects.forEach(g => g.onEvent(this, sender, message, payload));
  }
}
