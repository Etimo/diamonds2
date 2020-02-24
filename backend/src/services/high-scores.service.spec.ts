import { HighScoresService } from "./high-scores.service";
import { IdService } from "./id.service";
import { ConnectionOptions, Connection } from "typeorm";
import { HighScoreEntity } from "../db/models/highScores.entity";
import { ConnectEvent } from "@nestjs/common/interfaces/external/kafka-options.interface";
import { createConnection } from "typeorm";
import { configService } from "../config/config.service";
import { async } from "rxjs/internal/scheduler/async";

let highScoresService: HighScoresService;
let testBotName: string;
let numBotsCreatedOnConstructor: number;
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
beforeEach(async () => {
  highScoresService = new HighScoresService(
    connection.getRepository(HighScoreEntity),
  );
  testBotName = "specBot";
  numBotsCreatedOnConstructor = 1;
});
afterAll(() => {
  connection.close();
});

test("Add new score", async () => {
  await highScoresService.addOrUpdate({
    botName: testBotName,
    score: 22,
  });

  //console.log(highScoresService.all());
  let x = await highScoresService.getBotScore({
    botName: testBotName,
    score: 0,
  });

  expect(x.length).toEqual(1);
});

test("Update score", async () => {
  let bot = {
    botName: testBotName,
    score: 44,
  };

  await highScoresService.addOrUpdate(bot);

  let x = await highScoresService.getBotScore(bot);

  expect(x.length).toEqual(1);
});

test("Ignore lower score", async () => {
  let bot = {
    botName: testBotName,
    score: 5,
  };
  await highScoresService.addOrUpdate(bot);

  let x = await highScoresService.getBotScore(bot);

  expect(x.length).toEqual(1);
});
