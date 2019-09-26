import { Test, TestingModule } from '@nestjs/testing';
import { ExpiredBotsController } from './expired-bots.controller';

describe('ExpiredBots Controller', () => {
  let controller: ExpiredBotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpiredBotsController],
    }).compile();

    controller = module.get<ExpiredBotsController>(ExpiredBotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
