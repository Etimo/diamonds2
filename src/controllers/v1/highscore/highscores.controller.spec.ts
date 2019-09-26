import { Test, TestingModule } from "@nestjs/testing";
import { HighscoresController } from "./highscores.controller";

describe("Highscore Controller", () => {
  let controller: HighscoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HighscoresController],
    }).compile();

    controller = module.get<HighscoresController>(HighscoresController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
