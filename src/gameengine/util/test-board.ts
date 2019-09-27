import { Board } from "../board";

export default function createTestBoard(): Board {
  return new Board(
    {
      height: 10,
      width: 10,
      minimumDelayBetweenMoves: 100,
      sessionLength: 10,
    },
    [],
    console,
  );
}
