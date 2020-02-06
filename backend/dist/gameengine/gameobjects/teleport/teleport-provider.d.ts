import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
export declare class TeleportProvider extends AbstractGameObjectProvider {
    onBoardInitialized(board: Board): void;
    private generateTeleports;
}
