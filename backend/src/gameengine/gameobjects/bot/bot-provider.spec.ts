import { BotGameObject } from "../bot/bot";
import { Board } from "../../board";
import createTestBoard from "../../util/test-board";
import { BotProvider } from "./bot-provider";

let provider: BotProvider;
let board: Board;
let data = {};

beforeEach(() => {
  provider = new BotProvider({
    inventorySize: 5,
    canTackle: true,
  });
  board = createTestBoard();
  data = {
    botName: "name",
  };
});

test("Creates bot when someone joins a board", () => {
  provider.onBotJoined(data, board);

  expect(board.getGameObjectsByType(BotGameObject).length).toBe(1);
});

test("Initilizes score when creating bot", () => {
  provider.onBotJoined(data, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.score).toBe(0);
});

test("Initilizes diamonds when creating bot", () => {
  provider.onBotJoined(data, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.diamonds).toBe(0);
});

test("Initilizes timeJoined when creating bot", () => {
  provider.onBotJoined(data, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.timeJoined).toBeDefined();
});

test("Initilizes inventorySize when creating bot", () => {
  provider.onBotJoined(data, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.inventorySize).toBe(5);
});

test("Initilizes tackle when creating bot", () => {
  provider.onBotJoined(data, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.canTackle).toBe(true);
});

test("Initilizes name when creating bot", () => {
  provider.onBotJoined(data, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.name).toEqual("name");
});
