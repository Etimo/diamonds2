import { Board } from "../board.ts";
import { AbstractGameObjectProvider } from "../gameobjects/abstract-game-object-providers.ts";
import { SilentLogger } from "./silent-logger.ts";

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
      canTackle: true,
      inventorySize: 3,
      teleportRelocation: 30,
      teleporters: 2,
      dummyBots: 2,
      updateTimeStamp: new Date(),
      createTimeStamp: new Date(),
      separateBoards: false,
      id: "",
    },
    providers,
    new SilentLogger(),
  );
}
