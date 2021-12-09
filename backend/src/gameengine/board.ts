import { IBot } from "src/interfaces/bot.interface";
import { IPosition } from "../common/interfaces/position.interface";
import { BoardConfig } from "./board-config";
import { AbstractGameObject } from "./gameobjects/abstract-game-object";
import { AbstractGameObjectProvider } from "./gameobjects/abstract-game-object-providers";
import { BotGameObject } from "./gameobjects/bot/bot";

export class Board {
  private readonly _id: number;
  private bots: Object = {};
  /** List of game objects on the board. */
  private gameObjects: AbstractGameObject[] = [];
  /** Set of registered timer callbacks. */
  private callbackLoopsRegistered = {};
  private callbackLoopsId = {};
  /** List of callbacks that are triggerred whenever a session is finished. */
  private sessionFinishedCallbacks: Function[] = [];
  private botMoves = {};
  private botRateLimitViolations = {};

  constructor(
    id: number,
    public config: BoardConfig,
    public gameObjectProviders: AbstractGameObjectProvider[],
    protected logger: any,
  ) {
    this._id = id;
    this.notifyProvidersBoardInitialized();
  }

  /**
   * Return id of the board.
   */
  getId(): number {
    return this._id;
  }

  /**
   * Register a new callback that will be triggered whenever a game session is finished.
   *
   * @param callback
   */
  registerSessionFinishedCallback(callback: Function) {
    this.sessionFinishedCallbacks.push(callback);
  }

  /**
   * Remove a registered callback.
   *
   * @param callback
   */
  unregisterSessionFinishedCallback(callback: Function) {
    this.sessionFinishedCallbacks = this.sessionFinishedCallbacks.filter(
      c => c !== callback,
    );
  }

  /**
   * Add a new bot to the board and start a new game session.
   *
   * @param bot The bot to add to the board.
   */
  async join(bot: IBot) {
    // Add bot to board
    this.bots[bot.token] = bot;

    // Create expiration timer
    this.createNewExpirationTimer(bot);
    // ...and notify all providers
    this.notifyProvidersBoardBotJoined(bot);

    return true;
  }

  /**
   * Remove a bot from the board after a specific time
   *
   * @param bot The bot to remove to the board.
   * @param time Remove bot after time.
   */
  async removeBot(bot: IBot, time: number) {
    // Remove bot after X time
    this.createNewExpirationTimer(bot, time);
  }

  /**
   * Return a bot on the board matching the given token.
   *
   * @param token The token of the bot to find.
   */
  getBot(token: string): IBot {
    return this.bots[token];
  }

  /**
   * Return all bots on board
   * @returns All bots
   */
  getBots(): Object {
    return this.bots;
  }

  /**
   * Try to perform a move for a bot on the board.
   *
   * @param bot The bot to move.
   * @param delta The change in position to perform.
   * @returns True if the move succeeds, false otherwise.
   */
  public async move(bot: IBot, delta: IPosition) {
    const botGameObject = this.getGameObjectsByType(BotGameObject).find(
      b => b.name === bot.botName,
    );

    if (botGameObject) {
      const position = botGameObject.position;
      position.x = position.x + delta.x;
      position.y = position.y + delta.y;
      return this.trySetGameObjectPosition(botGameObject, position);
    }
    return false;
  }

  /**
   * Create a new timer that will clear out a bot from the board when their session finishes.
   * @param bot
   */
  private createNewExpirationTimer(bot: IBot, time: number = null) {
    const id = setTimeout(
      _ => {
        this.logger.debug(`Purge bot ${bot.botName}`);
        const botGameObject = this.getGameObjectsByType(BotGameObject).find(
          b => b.name === bot.botName,
        );
        if (!botGameObject) {
          return;
        }

        // Remove locally
        delete this.bots[bot.token];
        delete this.botMoves[bot.botName];
        delete this.botRateLimitViolations[bot.botName];

        // Notify all session finished callbacks
        this.sessionFinishedCallbacks.forEach(sfc =>
          sfc(botGameObject.name, botGameObject.score),
        );
        this.removeGameObject(botGameObject);
      },
      time ? time : this.config.sessionLength * 1000,
    );
    return id;
  }

  /**
   * Check if a position on the board is empty (contains no game objects) or not.
   *
   * @param x
   * @param y
   * @returns True if the cell is empty, false otherwise.
   */
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

  /**
   * Width of board.
   */
  get width() {
    return this.config.width;
  }

  /**
   * Height of board.
   */
  get height() {
    return this.config.height;
  }

  /**
   * Returns a list of all game objects currently on the board.
   */
  getAllGameObjects(): AbstractGameObject[] {
    return this.gameObjects;
  }

  /**
   * Add new game objects to the board and notify game object providers.
   *
   * @param gameObjects The game objects to add.
   */
  addGameObjects(gameObjects: AbstractGameObject[]) {
    this.gameObjects.push(...gameObjects);
    this.notifyProvidersGameObjectsAdded(gameObjects);
  }

  /**
   * Returns a list of game objects currently located on a given position on the board.
   *
   * @param p The position
   */
  getGameObjectsOnPosition(p: IPosition): AbstractGameObject[] {
    return this.gameObjects.filter(g => g.x === p.x && g.y === p.y);
  }

  trySetGameObjectPosition(
    gameObject: AbstractGameObject,
    dest: IPosition,
    skipLeaveCheck = false,
    skipEnterCheck = false,
  ): boolean {
    // Check if we can leave the current position
    if (!(skipLeaveCheck || this.canGameObjectLeave(gameObject, dest))) {
      return false;
    }

    // Check if we can enter the new position
    if (
      this.destinationIsOutOfBounds(dest) ||
      !(skipEnterCheck || this.canGameObjectEnter(gameObject, dest))
    ) {
      return false;
    }

    // Notfy game objects in current position that we are leaving to the new position
    const gameObjectsPrev = this.getGameObjectsOnPosition(gameObject.position);
    gameObjectsPrev.forEach(g => g.onGameObjectLeft(gameObject, this));

    // Notify game objects in new position that we are entering the new position
    const gameObjectsDest = this.getGameObjectsOnPosition(dest);

    // Update position of game object
    gameObject.position = dest;

    gameObjectsDest.forEach(g => g.onGameObjectEntered(gameObject, this));

    return true;
  }

  canGameObjectEnter(gameObject: AbstractGameObject, dest: IPosition): boolean {
    const gameObjects = this.getGameObjectsOnPosition(dest);
    return !gameObjects.some(g => !g.canGameObjectEnter(gameObject, this));
  }

  canGameObjectLeave(gameObject: AbstractGameObject, dest: IPosition): boolean {
    const gameObjects = this.getGameObjectsOnPosition(dest);
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
    const removed = this.gameObjects.filter(g => g instanceof t);
    this.gameObjects = this.gameObjects.filter(g => !(g instanceof t));
    this.notifyProvidersGameObjectsRemoved(removed);
  }

  private notifyProvidersGameObjectsRemoved(gameObjects: AbstractGameObject[]) {
    this.gameObjectProviders.forEach(p =>
      p.onGameObjectsRemoved(this, gameObjects),
    );
  }

  getLogString(gameObjects: AbstractGameObject[]): string {
    return JSON.stringify(gameObjects.map(g => g.toLogString()));
  }

  private notifyProvidersGameObjectsAdded(gameObjects: AbstractGameObject[]) {
    this.gameObjectProviders.forEach(p =>
      p.onGameObjectsAdded(this, gameObjects),
    );
  }

  private notifyProvidersBoardInitialized() {
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
    return this.botMoves[bot.botName];
  }

  updateLastMove(bot: IBot) {
    this.botMoves[bot.botName] = Date.now();
  }

  getRateLimitViolations(bot: IBot) {
    return this.botRateLimitViolations[bot.botName];
  }

  updateRateLimitViolations(bot: IBot) {
    if (!this.botRateLimitViolations[bot.botName]) {
      this.botRateLimitViolations[bot.botName] = 1;
    }
    this.botRateLimitViolations[bot.botName] += 1;
  }

  notifyGameObjectEvent(
    sender: AbstractGameObject,
    message: string,
    payload?: Object,
  ) {
    this.gameObjects.forEach(g => g.onEvent(this, sender, message, payload));
  }
}
