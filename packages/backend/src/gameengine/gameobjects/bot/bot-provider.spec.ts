import { IBot, ITeam } from "../../../types";
import { Board } from "../../board";
import { createTestBoard } from "../../util";
import { BotGameObject } from "../bot/bot";
import { BotProvider } from "./bot-provider";

let provider: BotProvider;
let board: Board;
let ibot: IBot;
let team: ITeam;

beforeEach(() => {
  provider = new BotProvider({
    inventorySize: 5,
    canTackle: true,
  });
  board = createTestBoard();
  team = {
    id: "1",
    name: "name",
    abbreviation: "name",
    logotypeUrl: "name",
    createTimeStamp: new Date(),
    updateTimeStamp: new Date(),
  };
  ibot = {
    id: "1",
    name: "name",
    email: "test@etimo.se",
    password: "password",
    createTimeStamp: new Date(),
    updateTimeStamp: new Date(),
    team,
    teamId: team.id,
  };
});

test("Creates bot when someone joins a board", () => {
  provider.onBotJoined(ibot, board);

  expect(board.getGameObjectsByType(BotGameObject).length).toBe(1);
});

test("Initilizes score when creating bot", () => {
  provider.onBotJoined(ibot, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.score).toBe(0);
});

test("Initilizes diamonds when creating bot", () => {
  provider.onBotJoined(ibot, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.diamonds).toBe(0);
});

test("Initilizes timeJoined when creating bot", () => {
  provider.onBotJoined(ibot, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.timeJoined).toBeDefined();
});

test("Initilizes inventorySize when creating bot", () => {
  provider.onBotJoined(ibot, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.inventorySize).toBe(5);
});

test("Initilizes tackle when creating bot", () => {
  provider.onBotJoined(ibot, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.canTackle).toBe(true);
});

test("Initilizes name when creating bot", () => {
  provider.onBotJoined(ibot, board);

  const bot = board.getGameObjectsByType(BotGameObject)[0];

  expect(bot.name).toEqual("name");
});
