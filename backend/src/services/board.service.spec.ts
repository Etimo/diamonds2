import { BotsService } from "./bots.service";
import { IdService } from "./id.service";
import { BoardsService } from "./board.service";
import { HighScoresService } from "./high-scores.service";
import { HighScoreEntity } from "../db/models/highScores.entity";
import { CustomLogger } from "../logger";
import UnauthorizedError from "../errors/unauthorized.error";
import { IBot } from "../interfaces/bot.interface";
import NotFoundError from "../errors/not-found.error";
import ConflictError from "../errors/conflict.error";
import { createConnection, Connection } from "typeorm";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";

let boardsService: BoardsService;
let botService: BotsService;
let highScoreService: HighScoresService;
const dummyBoardId = 1111111;
const dummyBoardToken = "dummy";
const dummyBotId = "dummyId";
let connection: Connection;

beforeAll(async () => {
  // const opt = {
  //   ...configService.getTypeOrmConfig(),
  //   debug: true,
  // };
  //TODO: FIX ConnectionOptions from configService.getTypeOrmConfig()
  connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    entities: ["**/*.entity{.ts,.js}"],
  });
});

afterAll(() => {
  connection.close();
});

beforeEach(() => {
  const idService = new IdService();
  botService = new BotsService(
    connection.getRepository(BotRegistrationsEntity),
  );
  highScoreService = new HighScoresService(
    connection.getRepository(HighScoreEntity),
  );
  boardsService = new BoardsService(
    botService,
    highScoreService,
    new CustomLogger(),
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
