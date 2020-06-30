import { Board } from "./board";
import createTestBoard from "./util/test-board";
import { BotGameObject } from "./gameobjects/bot/bot";
import { AbstractGameObject } from "./gameobjects/abstract-game-object";
import { BaseGameObject } from "./gameobjects/base/base";
import { DiamondProvider } from "./gameobjects/diamond/diamond-provider";
import { BotProvider } from "./gameobjects/bot/bot-provider";
import { IBot } from "src/interfaces/bot.interface";

let board: Board;
let opponent: BotGameObject;
let provider: DiamondProvider;
const botExampleData: IBot = {
  id: "1",
  email: "email",
  botName: "name",
  token: "1",
};

beforeEach(() => {
  provider = new DiamondProvider({
    generationRatio: 0.1,
    minRatioForGeneration: 0.01,
    redRatio: 0,
  });
  board = createTestBoard();
  opponent = new BotGameObject({ x: 1, y: 0 });
  board.addGameObjects([opponent]);
  jest.useFakeTimers();
});

test("board has some kind of id", () => {
  expect(board.getId()).toBeDefined();
});

describe("sessionFinishedCallbacks and join", () => {
  let provider: BotProvider;
  beforeEach(() => {
    provider = new BotProvider({
      inventorySize: 5,
      canTackle: true,
    });
    board = createTestBoard([provider]);
  });
  test("join creates expiration timer and callbacks are invoked when sessions are finished", async () => {
    let result = false;
    board.registerSessionFinishedCallback(() => {
      result = true;
    });
    await board.join(botExampleData);

    jest.runAllTimers();

    expect(result).toBeTruthy();
  });

  test("bot is removed from board when session finishes", async () => {
    await board.join(botExampleData);

    jest.runAllTimers();

    expect(board.getBot(botExampleData.token)).toBeFalsy();
  });

  test("join notifies providers", async () => {
    spyOn(provider, "onBotJoined");

    await board.join(botExampleData);

    expect(provider.onBotJoined).toHaveBeenCalled();
  });

  test("possible to get bot when joined", async () => {
    await board.join(botExampleData);

    expect(board.getBot(botExampleData.token)).toEqual(botExampleData);
  });
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

    const result = board.trySetGameObjectPosition(bot, { x: 0, y: 1 });

    expect(result).toBeTruthy();
    expect(bot.position).toStrictEqual({ x: 0, y: 1 });
  });

  test("when gameobject not allowed to move bot stays", () => {
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

describe("isCellEmpty", () => {
  test("returns false if at least one game object is located", () => {
    expect(
      board.isCellEmpty(opponent.position.x, opponent.position.y),
    ).toBeFalsy();
  });

  test("returns true if no game objects", () => {
    expect(
      board.isCellEmpty(opponent.position.x + 1, opponent.position.y),
    ).toBeTruthy();
  });
});

describe("getEmptyPosition", () => {
  test("returns an empty position", () => {
    const empty = board.getEmptyPosition();
    expect(empty).not.toEqual(opponent.position);
  });

  test("returns an empty position even though random checks fail", () => {
    spyOn(board, "getRandomPosition").and.returnValue(opponent.position);
    const empty = board.getEmptyPosition();
    expect(empty).not.toEqual(opponent.position);
  });

  test("returns null if no empty positions are found", () => {
    spyOn(board, "getRandomPosition").and.returnValue(opponent.position);
    spyOn(board, "isCellEmpty").and.returnValue(false);
    const empty = board.getEmptyPosition();
    expect(empty).toBeNull();
  });
});

test("getAllGameObjects returns a list of existing game objects", () => {
  expect(board.getAllGameObjects().length).toBe(1);
});

describe("getGameObjectsOnPosition", () => {
  test("returns all game objects on position", () => {
    expect(board.getGameObjectsOnPosition(opponent.position)).toEqual([
      opponent,
    ]);
  });
  test("returns empty list if no game objects on position", () => {
    expect(board.getGameObjectsOnPosition({ x: 0, y: 0 })).toEqual([]);
  });
  test("returns multiple game objects on same position", () => {
    const dummyObject: BotGameObject = new BotGameObject(opponent.position);
    board.addGameObjects([dummyObject]);

    expect(board.getGameObjectsOnPosition(opponent.position)).toEqual([
      opponent,
      dummyObject,
    ]);
  });
});

describe("canGameObjectEnter", () => {
  let blockingGameObject: AbstractGameObject;
  let allowingGameObject: AbstractGameObject;

  beforeEach(() => {
    blockingGameObject = new BotGameObject({
      x: opponent.x + 1,
      y: opponent.y,
    });
    spyOn(blockingGameObject, "canGameObjectEnter").and.returnValue(false);

    allowingGameObject = new BotGameObject({
      x: opponent.x,
      y: opponent.y + 1,
    });
    spyOn(allowingGameObject, "canGameObjectEnter").and.returnValue(true);

    board.addGameObjects([blockingGameObject, allowingGameObject]);
  });

  test("returns false if trying to move to a blocking game object", () => {
    expect(
      board.canGameObjectEnter(opponent, blockingGameObject.position),
    ).toBeFalsy();
  });

  test("returns true if trying to move to an allowing game object", () => {
    expect(
      board.canGameObjectEnter(opponent, allowingGameObject.position),
    ).toBeTruthy();
  });
});

describe("canGameObjectLeave", () => {
  let blockingGameObject: AbstractGameObject;
  let allowingGameObject: AbstractGameObject;

  beforeEach(() => {
    blockingGameObject = new BotGameObject({
      x: opponent.x + 1,
      y: opponent.y,
    });
    spyOn(blockingGameObject, "canGameObjectLeave").and.returnValue(false);

    allowingGameObject = new BotGameObject({
      x: opponent.x,
      y: opponent.y + 1,
    });
    spyOn(allowingGameObject, "canGameObjectLeave").and.returnValue(true);

    board.addGameObjects([blockingGameObject, allowingGameObject]);
  });

  test("returns false if trying to move to a blocking game object", () => {
    expect(
      board.canGameObjectLeave(opponent, blockingGameObject.position),
    ).toBeFalsy();
  });

  test("returns true if trying to move to an allowing game object", () => {
    expect(
      board.canGameObjectLeave(opponent, allowingGameObject.position),
    ).toBeTruthy();
  });
});

describe("removeGameObject", () => {
  test("removes game object from list", () => {
    board.removeGameObject(opponent);

    expect(board.getAllGameObjects().length).toBe(0);
  });
  test("calls onGameObjectRemoved on game object", () => {
    spyOn(opponent, "onGameObjectRemoved");

    board.removeGameObject(opponent);

    expect(opponent.onGameObjectRemoved).toHaveBeenCalled();
  });
});

describe("removeGameObjectsByType", () => {
  let baseGameObject: BaseGameObject;
  beforeEach(() => {
    baseGameObject = new BaseGameObject({ x: 0, y: 0 } as BotGameObject);
    board.addGameObjects([baseGameObject]);
  });

  test("removes from array", () => {
    board.removeGameObjectsByType(BaseGameObject);

    expect(board.getAllGameObjects()).toEqual([opponent]);
  });

  test("calls onGameObjectRemoved on each removed game object", () => {
    spyOn(opponent, "onGameObjectRemoved");

    board.removeGameObjectsByType(BotGameObject);

    expect(opponent.onGameObjectRemoved).toHaveBeenCalled();
  });
  test("notifies providers", () => {
    board = createTestBoard([provider]);
    spyOn(provider, "onGameObjectsRemoved");

    board.removeGameObjectsByType(BotGameObject);

    expect(provider.onGameObjectsRemoved).toHaveBeenCalled();
  });
});

describe("addGameObjects", () => {
  let baseGameObject: BaseGameObject;
  beforeEach(() => {
    board = createTestBoard([provider]);
    baseGameObject = new BaseGameObject({ x: 0, y: 0 } as BotGameObject);
  });

  test("adds to array", () => {
    let countBefore = board.getAllGameObjects().length;

    board.addGameObjects([baseGameObject]);

    expect(board.getAllGameObjects().length).toBe(countBefore + 1);
  });

  test("notifies providers", () => {
    spyOn(provider, "onGameObjectsAdded");

    board.addGameObjects([baseGameObject]);

    expect(provider.onGameObjectsAdded).toHaveBeenCalled();
  });
});
