import { BotsService } from "./bots.service";
import { IdService } from "./id.service";
import { BoardsService } from "./board.service";
import { HighScoresService } from "./high-scores.service";
import UnauthorizedError from "../errors/unauthorized.error";
import { IBot } from "../interfaces/bot.interface";
import NotFoundError from "../errors/not-found.error";
import SilentLogger from "../gameengine/util/silent-logger";
import { CustomLogger } from "src/logger";

let boardsService: BoardsService;
let botService: BotsService;
let highScoreService: HighScoresService;
const dummyBoardId = 1111111;
const dummyBoardToken = "dummy";
const dummyBotId = "dummyId";

beforeEach(() => {
  const idService = new IdService();
  botService = new BotsService(idService);
  highScoreService = new HighScoresService(idService);
  boardsService = new BoardsService(
    botService,
    highScoreService,
    new SilentLogger() as CustomLogger,
  );
});

test("Should throw UnauthorizedError when bot not exists", async () => {
  spyOn(botService, "get").and.returnValue(undefined);
  await expect(
    boardsService.join(dummyBoardId, dummyBoardToken),
  ).rejects.toThrowError(UnauthorizedError);
});

test("Should throw NotFoundError when board not exists", async () => {
  spyOn(botService, "get").and.returnValue({} as IBot);
  await expect(
    boardsService.join(dummyBoardId, dummyBoardToken),
  ).rejects.toThrowError(NotFoundError);
});
