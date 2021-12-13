import { HighScoresService } from "./high-scores.service";
import { Repository, SelectQueryBuilder, Connection } from "typeorm";
import { HighScoreEntity } from "../db/models/highScores.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { HighscoreDto } from "../models/highscore.dto";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SeasonsService } from "./seasons.service";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { SeasonDto } from "../models/season.dto";
import { HighscoresRepository } from "../db/repositories/highscores.repository";
import { createTestingModule } from "../test-utils";

describe("HighScoresService", () => {
  let highScoresService: HighScoresService;
  let seasonService: SeasonsService;
  let testBotName: string = "testBot";
  let seasonId = "c43eee94-f363-4097-85e2-db3b48ed2d79";
  let highscoresRepository: HighscoresRepository;

  let currentSeason = {
    id: seasonId,
    name: "Off Season",
    startDate: new Date(),
    endDate: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule();
    highScoresService = module.get<HighScoresService>(HighScoresService);
    seasonService = module.get<SeasonsService>(SeasonsService);
    highscoresRepository = module.get<HighscoresRepository>(
      HighscoresRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
