import { HighScoresService } from "./high-scores.service";
import { IdService } from "./id.service";

let highScoresService: HighScoresService;
let testBotName: string;
let numBotsCreatedOnConstructor: number;

beforeAll(() => {
  highScoresService = new HighScoresService(new IdService());
  testBotName = "specBot";
  numBotsCreatedOnConstructor = 1;
});

test("Add new score", () => {
  highScoresService.addOrUpdate({
    botName: testBotName,
    score: 33,
  });

  expect(highScoresService.all().length).toEqual(
    numBotsCreatedOnConstructor + 1,
  );
});

test("Update score", () => {
  highScoresService.addOrUpdate({
    botName: testBotName,
    score: 44,
  });

  expect(highScoresService.all().length).toEqual(
    numBotsCreatedOnConstructor + 1,
  );
});

test("Ignore lower score", () => {
  highScoresService.addOrUpdate({
    botName: testBotName,
    score: 5,
  });

  expect(highScoresService.all().length).toEqual(
    numBotsCreatedOnConstructor + 1,
  );
});
