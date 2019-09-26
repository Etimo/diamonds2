import { AbstractGameObject } from "./gameobjects/abstract-game-object";
import { IBot } from "src/interfaces/bot.interface";
import { AbstractGameObjectProvider } from "./gameobjects/abstract-game-object-providers";
import { IPosition } from "src/common/interfaces/position.interface";
import { BoardConfig } from "./board-config";
import { LoggerService } from "@nestjs/common";

export class Board {
  private static nextId = 1;
  private readonly _id = `${Board.nextId++}`;
  private bots: IBot[] = [];
  private gameObjects: AbstractGameObject[] = [];
  public readonly maxNumberOfCarryingDiamonds: number = 5;
  private expirationTimers = {};
  private callbackLoopsRegistered = {};
  private callbackLoopsId = {};

  constructor(
    private config: BoardConfig,
    private gameObjectProviders: AbstractGameObjectProvider[],
    private logger: any,
  ) {
    this.notifyProvidersBoardInitialized();
  }

  getId() {
    return this._id;
  }

  join(bot: IBot): boolean {
    // this.gameObjectProviders.forEach(p => p.onBotJoined(bot))
    // this.notifyProvidersBoardBotJoined();
    this.expirationTimers[bot.id] = this.getNewExpirationTimer(bot);
    const boardBot = {};
    return false;
  }

  public move(bot: IBot, position: Position): boolean {
    return true;
  }

  private getNewExpirationTimer(bot: IBot) {
    const id = setTimeout(_ => {
      // TODO: add lock
      this.logger.debug("Purge bot", bot.id);
    }, 2000);
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
        this.callbackLoopsRegistered[interval].forEach(
          (g: AbstractGameObject) =>
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

  getAllGameObjectProviders(): AbstractGameObjectProvider[] {
    return this.gameObjectProviders;
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
    // Check if we can leave the current position
    if (!(skipLeaveCheck || this.canGameObjectLeave(gameObject, dest))) {
      this.logger.debug("Not allowed to leave");
      return false;
    }

    // Check if we can enter the new position
    if (!(skipEnterCheck || this.canGameObjectEnter(gameObject, dest))) {
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
      "notifyProvidersGameObjectsRemoved",
      JSON.stringify(gameObjects),
    );
    this.gameObjectProviders.forEach(p =>
      p.onGameObjectsRemoved(this, gameObjects),
    );
  }

  private notifyProvidersGameObjectsAdded(gameObjects: AbstractGameObject[]) {
    this.logger.debug(
      "notifyProvidersGameObjectsAdded",
      JSON.stringify(gameObjects),
    );
    this.gameObjectProviders.forEach(p =>
      p.onGameObjectsAdded(this, gameObjects),
    );
  }

  private notifyProvidersBoardInitialized() {
    this.logger.debug("notifyProvidersBoardInitialized");
    this.gameObjectProviders.forEach(p => p.onBoardInitialized(this));
  }

  private notifyProvidersBoardBotJoined() {
    this.gameObjectProviders.forEach(p => p.onBotJoined(null, this));
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
