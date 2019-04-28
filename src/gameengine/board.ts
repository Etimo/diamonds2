import { IBoardBot } from "src/interfaces/board-bot.interface";
import { AbstractGameObject } from "./gameobjects/game-object";
import { IBot } from "src/interfaces/bot.interface";

export class Board {
    private bots: IBoardBot[] = [];
    public readonly width: number;
    public readonly height: number;
    private gameObjects: AbstractGameObject[] = [];
    public readonly maxNumberOfCarryingDiamonds: number = 5;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    join(bot: IBot): IBoardBot {
        const boardBot = {
            
        }
    }

    isCellEmpty(x: number, y: number): boolean {
        return !this.gameObjects.some(g => g.getX() === x && g.getY() === y);
    }

    addGameObject(gameObject: AbstractGameObject) {
        this.gameObjects.push(gameObject);
    }

    getMaxNumberOfCarryingDiamonds(): number {
        return this.maxNumberOfCarryingDiamonds;
    }

    getGameObjectsByType<T extends AbstractGameObject>(): T[] {
        // return this.gameObjects.filter(g => g);
        return [];
    }

    removeGameObject(gameObject: AbstractGameObject) {
        gameObject.onGameObjectRemoved(this);
        this.gameObjects = this.gameObjects.filter(g => g !== gameObject);
    }

    removeGameObjectsByType<T extends AbstractGameObject>() {
        this.gameObjects.forEach(g => g.onGameObjectRemoved(this));
        this.gameObjects = this.gameObjects.filter(g => g instanceof T);
    }
}