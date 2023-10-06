import { Position } from "@etimo/diamonds2-types";
import { IBot } from "../types";
import { Board } from "./board";
import { AbstractGameObject } from "./gameobjects/abstract-game-object";
import { BaseGameObject } from "./gameobjects/base/base";
import { BotGameObject } from "./gameobjects/bot/bot";
import { BotProvider } from "./gameobjects/bot/bot-provider";
import { DiamondProvider } from "./gameobjects/diamond/diamond-provider";
import { createTestBoard, createTestBot } from "./util";

let opponentPosition: Position;
let board: Board;
let opponent: BotGameObject;
let blockingGameObject: BotGameObject;
let allowingGameObject: BotGameObject;
let provider: DiamondProvider;

let botExampleData: IBot = {
  id: "1",
  email: "email",
  name: "name",
} as unknown as IBot;

beforeEach(() => {
  provider = new DiamondProvider({
    generationRatio: 0.1,
    minRatioForGeneration: 0.01,
    redRatio: 0,
  });
  opponentPosition = { x: 1, y: 0 };
  board = createTestBoard();
  opponent = createTestBot();
  opponent.position = opponentPosition;
  blockingGameObject = createTestBot();
  allowingGameObject = createTestBot();
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
    // Arrange
    let result = false;
    board.registerSessionFinishedCallback(() => {
      result = true;
    });

    // Act
    await board.join(botExampleData);
    jest.runAllTimers();

    // Assert
    expect(result).toBeTruthy();
  });

  test("bot is removed from board when session finishes", async () => {
    // Act
    await board.join(botExampleData);
    jest.runAllTimers();

    // Assert
    expect(board.getBotById(botExampleData.id)).toBeFalsy();
  });

  test("join notifies providers", async () => {
    // Arrange
    jest.spyOn(provider, "onBotJoined");

    // Act
    await board.join(botExampleData);

    // Assert
    expect(provider.onBotJoined).toHaveBeenCalled();
  });

  test("possible to get bot when joined", async () => {
    // Act
    await board.join(botExampleData);

    // Assert
    expect(board.getBotById(botExampleData.id)).toEqual(botExampleData);
  });
});

describe("trySetGameObjectPosition", () => {
  let bot: BotGameObject;
  beforeEach(() => {
    bot = createTestBot();
  });

  test("going out of bounds returns false to the west", () => {
    // Arrange
    let initialPosition: Position = { x: 0, y: 0 };
    bot.position = initialPosition;

    // Act
    let result = board.trySetGameObjectPosition(bot, { x: -1, y: 0 });

    // Assert
    expect(result).toBeFalsy();
    expect(bot.position).toStrictEqual(initialPosition);
  });

  test("going out of bounds returns false to the east", () => {
    // Arrange
    let initialPosition: Position = { x: 9, y: 0 };
    bot.position = initialPosition;

    // Act
    let result = board.trySetGameObjectPosition(bot, { x: 10, y: 0 });

    // Assert
    expect(result).toBeFalsy();
    expect(bot.position).toStrictEqual(initialPosition);
  });
  test("going out of bounds returns false to the north", () => {
    // Arrange
    let initialPosition: Position = { x: 0, y: 0 };
    bot.position = initialPosition;

    // Act
    let result = board.trySetGameObjectPosition(bot, { x: 0, y: -1 });

    // Assert
    expect(result).toBeFalsy();
    expect(bot.position).toStrictEqual(initialPosition);
  });
  test("going out of bounds returns false to the south", () => {
    // Arrange
    let initialPosition = { x: 0, y: 9 };
    bot.position = initialPosition;

    // Act
    let result = board.trySetGameObjectPosition(bot, { x: 0, y: 10 });

    // Assert
    expect(result).toBeFalsy();
    expect(bot.position).toStrictEqual(initialPosition);
  });

  test("updates bot position", () => {
    // Arrange
    let initialPosition = { x: 0, y: 0 };
    bot.position = initialPosition;

    // Act
    let result = board.trySetGameObjectPosition(bot, { x: 0, y: 1 });

    // Assert
    expect(result).toBeTruthy();
    expect(bot.position).toStrictEqual({ x: 0, y: 1 });
  });

  test("when gameobject not allowed to move bot stays", () => {
    // Arrange
    let initialPosition = { x: 0, y: 0 };
    bot.position = initialPosition;
    jest.spyOn(opponent, "canGameObjectEnter").mockReturnValue(false);

    // Act
    let result = board.trySetGameObjectPosition(bot, { x: 1, y: 0 });

    // Assert
    expect(result).toBeFalsy();
    expect(bot.position).toStrictEqual(initialPosition);
  });

  test("when bot move gameObjectEntered is triggered on gameobjects on destination", () => {
    // Arrange
    let initialPosition = { x: 0, y: 0 };
    bot.position = initialPosition;
    jest.spyOn(opponent, "canGameObjectEnter").mockReturnValue(true);
    jest.spyOn(opponent, "onGameObjectEntered");

    // Act
    let result = board.trySetGameObjectPosition(bot, { x: 1, y: 0 });

    // Assert
    expect(result).toBeTruthy();
    expect(bot.position).toStrictEqual({ x: 1, y: 0 });
    expect(opponent.onGameObjectEntered).toHaveBeenCalledTimes(1);
  });
});

describe("isCellEmpty", () => {
  test("returns false if at least one game object is located", () => {
    // Act -> Assert
    expect(
      board.isCellEmpty(opponent.position.x, opponent.position.y),
    ).toBeFalsy();
  });

  test("returns true if no game objects", () => {
    // Act -> Assert
    expect(
      board.isCellEmpty(opponent.position.x + 1, opponent.position.y),
    ).toBeTruthy();
  });
});

describe("getEmptyPosition", () => {
  test("returns an empty position", () => {
    // Act
    let empty = board.getEmptyPosition();

    // Assert
    expect(empty).not.toEqual(opponent.position);
  });

  test("returns an empty position even though random checks fail", () => {
    // Arrange
    jest.spyOn(board, "getRandomPosition").mockReturnValue(opponent.position);

    // Act
    let empty = board.getEmptyPosition();

    // Assert
    expect(empty).not.toEqual(opponent.position);
  });

  test("returns null if no empty positions are found", () => {
    // Arrange
    jest.spyOn(board, "getRandomPosition").mockReturnValue(opponent.position);
    jest.spyOn(board, "isCellEmpty").mockReturnValue(false);

    // Act
    let empty = board.getEmptyPosition();

    // Assert
    expect(empty).toBeNull();
  });
});

test("getAllGameObjects returns a list of existing game objects", () => {
  // Act -> Assert
  expect(board.getAllGameObjects().length).toBe(1);
});

describe("getGameObjectsOnPosition", () => {
  test("returns all game objects on position", () => {
    // Act -> Assert
    expect(board.getGameObjectsOnPosition(opponent.position)).toEqual([
      opponent,
    ]);
  });

  test("returns empty list if no game objects on position", () => {
    // Act -> Assert
    expect(board.getGameObjectsOnPosition({ x: 0, y: 0 })).toEqual([]);
  });

  test("returns multiple game objects on same position", () => {
    // Arrage
    let dummyObject: BotGameObject = createTestBot();
    dummyObject.position = opponentPosition;

    // Act
    board.addGameObjects([dummyObject]);

    // Assert
    expect(board.getGameObjectsOnPosition(opponent.position)).toEqual([
      opponent,
      dummyObject,
    ]);
  });
});

describe("canGameObjectEnter", () => {
  let blockingGameObject: AbstractGameObject = createTestBot();
  let allowingGameObject: AbstractGameObject = createTestBot();

  beforeEach(() => {
    // Arrange
    blockingGameObject.position.x += 1;
    jest.spyOn(blockingGameObject, "canGameObjectEnter").mockReturnValue(false);

    allowingGameObject.position.y += 1;
    jest.spyOn(allowingGameObject, "canGameObjectEnter").mockReturnValue(true);

    board.addGameObjects([blockingGameObject, allowingGameObject]);
  });

  test("returns false if trying to move to a blocking game object", () => {
    // Act -> Assert
    expect(
      board.canGameObjectEnter(opponent, blockingGameObject.position),
    ).toBeFalsy();
  });

  test("returns true if trying to move to an allowing game object", () => {
    // Act -> Assert
    expect(
      board.canGameObjectEnter(opponent, allowingGameObject.position),
    ).toBeTruthy();
  });
});

describe("canGameObjectLeave", () => {
  let blockingGameObject: BotGameObject = createTestBot();
  let allowingGameObject: BotGameObject = createTestBot();

  beforeEach(() => {
    // Arrange
    let pos = { x: 1, y: 1 };
    opponent.position = pos;

    blockingGameObject.position.x = pos.x + 1;
    blockingGameObject.position.y = pos.y;
    jest.spyOn(blockingGameObject, "canGameObjectLeave").mockReturnValue(false);

    allowingGameObject.position.x = pos.x;
    allowingGameObject.position.y = pos.y + 1;
    jest.spyOn(allowingGameObject, "canGameObjectLeave").mockReturnValue(true);

    board.addGameObjects([blockingGameObject, allowingGameObject]);
  });

  test("returns false if trying to move to a blocking game object", () => {
    // Act -> Assert
    expect(
      board.canGameObjectLeave(opponent, blockingGameObject.position),
    ).toBeFalsy();
  });

  test("returns true if trying to move to an allowing game object", () => {
    // Act -> Assert
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
    jest.spyOn(opponent, "onGameObjectRemoved");

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
    jest.spyOn(opponent, "onGameObjectRemoved");

    board.removeGameObjectsByType(BotGameObject);

    expect(opponent.onGameObjectRemoved).toHaveBeenCalled();
  });
  test("notifies providers", () => {
    board = createTestBoard([provider]);
    jest.spyOn(provider, "onGameObjectsRemoved");

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
    jest.spyOn(provider, "onGameObjectsAdded");

    board.addGameObjects([baseGameObject]);

    expect(provider.onGameObjectsAdded).toHaveBeenCalled();
  });
});
