import { Board } from "../board";
import { AbstractGameObjectProvider } from "../gameobjects/abstract-game-object-providers";
import { SilentLogger } from "./silent-logger";

export function createTestBoard(
  providers: AbstractGameObjectProvider[] = [],
): Board {
  return new Board(
    1,
    {
      height: 10,
      width: 10,
      minimumDelayBetweenMoves: 100,
      sessionLength: 10,
    },
    providers,
    new SilentLogger(),
  );
}
