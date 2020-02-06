import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
export interface Config {
    minRatioForGeneration: number;
    generationRatio: number;
}
export declare class DiamondProvider extends AbstractGameObjectProvider {
    private config;
    constructor(config: Config);
    onBoardInitialized(board: Board): void;
    onGameObjectsRemoved(board: Board, other: any): void;
    private generateDiamonds;
}
