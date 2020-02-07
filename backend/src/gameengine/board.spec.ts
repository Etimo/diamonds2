import { Board } from "./board";
import createTestBoard from "./util/test-board";
import { BotGameObject } from "./gameobjects/bot/bot";

let board: Board;
let opponent: BotGameObject;
beforeEach(() => {
  board = createTestBoard();
  opponent = new BotGameObject({ x: 1, y: 0 });
  board.addGameObjects([opponent]);
});

describe("trySetGameObjectPosition", () => {
  test("going out of bounds returns false to the west", () => {
    const initialPosition = { x: 0, y: 0 };
    const bot = new BotGameObject(initialPosition);

    const result = board.trySetGameObjectPosition(bot, { x: -1, y: 0 });

    expect(result).toBeFalsy();
    expect(bot.position).toStrictEqual(initialPosition);
  });
  test("going out of bounds returns false to the east", () => {
    const initialPosition = { x: 9, y: 0 };
    const bot = new BotGameObject(initialPosition);

    const result = board.trySetGameObjectPosition(bot, { x: 10, y: 0 });

    expect(result).toBeFalsy();
    expect(bot.position).toStrictEqual(initialPosition);
  });
  test("going out of bounds returns false to the north", () => {
    const initialPosition = { x: 0, y: 0 };
    const bot = new BotGameObject(initialPosition);

    const result = board.trySetGameObjectPosition(bot, { x: 0, y: -1 });

    expect(result).toBeFalsy();
    expect(bot.position).toStrictEqual(initialPosition);
  });
  test("going out of bounds returns false to the south", () => {
    const initialPosition = { x: 0, y: 9 };
    const bot = new BotGameObject(initialPosition);

    const result = board.trySetGameObjectPosition(bot, { x: 0, y: 10 });

    expect(result).toBeFalsy();
    expect(bot.position).toStrictEqual(initialPosition);
  });

  test("updates bot position", () => {
    const initialPosition = { x: 0, y: 0 };
    const bot = new BotGameObject(initialPosition);

    const result = board.trySetGameObjectPosition(bot, { x: 1, y: 0 });

    expect(result).toBeTruthy();
    expect(bot.position).toStrictEqual({ x: 1, y: 0 });
  });

  test("when gameobject not allow move bot stays", () => {
    const initialPosition = { x: 0, y: 0 };
    const bot = new BotGameObject(initialPosition);
    spyOn(opponent, "canGameObjectEnter").and.returnValue(false);

    const result = board.trySetGameObjectPosition(bot, { x: 1, y: 0 });

    expect(result).toBeFalsy();
    expect(bot.position).toStrictEqual(initialPosition);
  });

  test("when bot move gameObjectEntered is triggered on gameobjects on destination", () => {
    const initialPosition = { x: 0, y: 0 };
    const bot = new BotGameObject(initialPosition);
    spyOn(opponent, "canGameObjectEnter").and.returnValue(true);
    spyOn(opponent, "onGameObjectEntered");

    const result = board.trySetGameObjectPosition(bot, { x: 1, y: 0 });

    expect(result).toBeTruthy();
    expect(bot.position).toStrictEqual({ x: 1, y: 0 });
    expect(opponent.onGameObjectEntered).toHaveBeenCalledTimes(1);
  });
});
