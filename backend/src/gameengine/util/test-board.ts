import { Board } from "../board";
import SilentLogger from "./silent-logger";

export default function createTestBoard(): Board {
  return new Board(
    {
      height: 10,
      width: 10,
      minimumDelayBetweenMoves: 100,
      sessionLength: 10,
    },
    [],
    new SilentLogger(),
  );
}
