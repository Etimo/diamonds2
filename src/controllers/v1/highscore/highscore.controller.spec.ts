import { Test, TestingModule } from "@nestjs/testing";
import { HighscoreController } from "./highscore.controller";

describe("Highscore Controller", () => {
  let controller: HighscoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HighscoreController],
    }).compile();

    controller = module.get<HighscoreController>(HighscoreController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
