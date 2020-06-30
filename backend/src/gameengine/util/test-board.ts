import { Board } from "../board";
import SilentLogger from "./silent-logger";
import { AbstractGameObjectProvider } from "../gameobjects/abstract-game-object-providers";

export default function createTestBoard(
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
