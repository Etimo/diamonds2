import { IBoardBot } from "src/interfaces/board-bot.interface";
import { AbstractGameObject } from "./gameobjects/game-object";
import { IBot } from "src/interfaces/bot.interface";
import { AbstractGameObjectProvider } from "./gameobjects/game-object-providers";
import { IPosition } from "src/common/interfaces/position.interface";
import { BoardConfig } from "./board-config";

export class Board {
  private bots: IBot[] = [];
  private gameObjects: AbstractGameObject[] = [];
  public readonly maxNumberOfCarryingDiamonds: number = 5;
  private expirationTimers = {};
  private callbackLoopsRegistered = {};
  private callbackLoopsId = {};

  constructor(private config: BoardConfig, private gameObjectProviders: AbstractGameObjectProvider[], private logger: any) {
    this.notifyProvidersBoardInitialized();
  }

  join(bot: IBot): boolean {
    // this.gameObjectProviders.forEach(p => p.onBotJoined(bot))
    // this.notifyProvidersBoardBotJoined();
    this.expirationTimers[bot.id] = this.getNewExpirationTimer(bot);
    const boardBot = {};
    return false;
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

  registerGameObjectForCallbackLoop(gameObject: AbstractGameObject, interval: number) {
    if (!(interval in this.callbackLoopsRegistered)) {
      // Setup new interval in callbackloops
      const id = setInterval(_ => {
        // TODO: add lock
        this.logger.debug(`Callback loop triggered for interval ${interval}`);
        this.callbackLoopsRegistered[interval].forEach((g: AbstractGameObject) => g.onGameObjectCallbackNotified(this));
        console.log(this.toString());
      }, interval);
      this.callbackLoopsRegistered[interval] = [gameObject];
      this.callbackLoopsId[interval] = id;
    } else {
      this.callbackLoopsRegistered[interval].push(gameObject);
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
    for(var i = 0; i < this.config.width * this.config.height; i++) {
      const {x, y} = this.getRandomPosition();
      if (this.isCellEmpty(x, y)) {
        return {x, y};
      }
    }

    // If not found, try more systematic so we dont get stuck in an endless loop
    for(var i = 0; i < this.config.width * this.config.height; i++) {
      const x = i % this.config.width;
      const y = Math.floor(i / this.config.height);
      if (this.isCellEmpty(x, y)) {
        return {x, y};
      }
    }

    return null;
  }

  getRandomPosition(): IPosition {
    return {
      x: Math.floor(Math.random() * this.config.width),
      y: Math.floor(Math.random() * this.config.height)
    };
  }

  addGameObjects(gameObjects: AbstractGameObject[]) {
    this.gameObjects.push(...gameObjects);
    this.notifyProvidersGameObjectsAdded(gameObjects);
  }

  getConfig(): BoardConfig {
    return this.config;
  }

  private getGameObjectOnPosition(p: IPosition): AbstractGameObject[] {
    return this.gameObjects.filter(g => g.x === p.x && g.y === p.y)
  }

  private moveGameObject(gameObject: AbstractGameObject, dx: number, dy: number) {
    const current = {x: gameObject.x, y: gameObject.y};
    const dest = {x: gameObject.x + dx, y: gameObject.y + dy};
    const gameObjectsDest = this.getGameObjectOnPosition(dest);
    if (this.canGameObjectMoveTo(gameObject, dest)) {
      const gameObjectsPrev = this.getGameObjectOnPosition(current);
      this.logger.debug(JSON.stringify(gameObject), "left", current);
      gameObjectsPrev.forEach(g => g.onGameObjectLeft(gameObject, this));
      gameObject.position = dest;
      this.logger.debug(JSON.stringify(gameObject), "entered", current, gameObjectsDest.length);
      gameObjectsDest.forEach(g => g.onGameObjectEntered(gameObject, this));
    }
  }

  moveGameObjectX(gameObject: AbstractGameObject, dx: number) {
    this.moveGameObject(gameObject, dx, 0);
  }

  moveGameObjectY(gameObject: AbstractGameObject, dy: number) {
    this.moveGameObject(gameObject, 0, dy);
  }

  private canGameObjectMoveTo(gameObject: AbstractGameObject, dest: IPosition): boolean {
    const gameObjects = this.getGameObjectOnPosition(dest);
    return !gameObjects.some(g => !g.canGameObjectEnter(gameObject, this));
  }

  get width() {
    return this.config.width;
  }

  get height() {
    return this.config.height;
  }

  /**
   * Get an array of all game objects matching the given type T.
   * 
   * @returns T[] Array of game objects.
   */
  getGameObjectsByType<T extends AbstractGameObject>(t: new (...args: any[]) => T): T[] {
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
  removeGameObjectsByType<T extends AbstractGameObject>(t: new (...args: any[]) => T) {
    this.gameObjects.forEach(g => g.onGameObjectRemoved(this));
    const removed = this.gameObjects.filter(g => !(g instanceof t));
    this.gameObjects = this.gameObjects.filter(g => g instanceof t);
    this.notifyProvidersGameObjectsRemoved(removed);
  }

  private notifyProvidersGameObjectsRemoved(gameObjects: AbstractGameObject[]) {
    this.logger.debug("notifyProvidersGameObjectsRemoved", JSON.stringify(gameObjects));
    this.gameObjectProviders.forEach(p => p.onGameObjectsRemoved(this, gameObjects));
  }

  private notifyProvidersGameObjectsAdded(gameObjects: AbstractGameObject[]) {
    this.logger.debug("notifyProvidersGameObjectsAdded", JSON.stringify(gameObjects));
    this.gameObjectProviders.forEach(p => p.onGameObjectsAdded(this, gameObjects));
  }

  private notifyProvidersBoardInitialized() {
    this.logger.debug("notifyProvidersBoardInitialized");
    this.gameObjectProviders.forEach(p => p.onBoardInitialized(this));
  }

  private notifyProvidersBoardBotJoined() {
    this.gameObjectProviders.forEach(p => p.onBotJoined(null, this));
  }

  toString() {
    const cellSize = 3;
    //"┓┗┛┏┃━"
    const ret = ["┏" + "".padEnd(this.width * cellSize, "━") + "┓"];
    for(var y = 0; y < this.height; y++) {
      const line = ["┃"];
      for(var x = 0; x < this.width; x++) {
        const gameObjects = this.gameObjects.filter(g => g.x === x && g.y === y);
        var existing = gameObjects.map(g => g.toChar()).join("").padEnd(cellSize, " ");
        line.push(existing);

      }
      line.push("┃");
      ret.push(line.join(""));
    }
    ret.push("┗" + "".padEnd(this.width * cellSize, "━") + "┛")
    return ret.join("\n");
  }
}
