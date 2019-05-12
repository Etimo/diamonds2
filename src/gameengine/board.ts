import { IBoardBot } from "src/interfaces/board-bot.interface";
import { AbstractGameObject } from "./gameobjects/game-object";
import { IBot } from "src/interfaces/bot.interface";
import { AbstractGameObjectProvider } from "./gameobjects/game-object-providers";
import { IPosition } from "src/interfaces/position.interface";
import { BoardConfig } from "./board-config";

export class Board {
  private bots: IBot[] = [];
  private gameObjects: AbstractGameObject[] = [];
  public readonly maxNumberOfCarryingDiamonds: number = 5;

  constructor(private config: BoardConfig, private gameObjectProviders: AbstractGameObjectProvider[]) {
    this.notifyProvidersBoardInitialized();
  }

  join(bot: IBot): boolean {
    // this.gameObjectProviders.forEach(p => p.onBotJoined(bot))
    const boardBot = {};
    return false;
  }

  isCellEmpty(x: number, y: number): boolean {
    return !this.gameObjects.some(g => g.x === x && g.y === y);
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
    this.gameObjectProviders.forEach(p => p.onGameObjectsRemoved(this, gameObjects));
  }

  private notifyProvidersGameObjectsAdded(gameObjects: AbstractGameObject[]) {
    this.gameObjectProviders.forEach(p => p.onGameObjectsAdded(this, gameObjects));
  }

  private notifyProvidersBoardInitialized() {
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
