import { GameObjectDto } from "./game-object.dto";
export declare class BoardDto {
    id: string;
    width: number;
    height: number;
    minimumDelayBetweenMoves: number;
    gameObjects: GameObjectDto[];
}
