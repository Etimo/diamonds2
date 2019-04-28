import { Module } from '@nestjs/common';
import { BotsController } from './bots.controller';
import { BoardsController } from './boards.controller';
import { HighscoresController } from './highscores.controller';
import { BoardsService } from './services/boards.service';
import { IdService } from './services/id-service.service';
import { ValidatorService } from './services/validator.service';
import { BotsService } from './services/bots.service';

@Module({
  controllers: [BotsController, BoardsController, HighscoresController],
  imports: [],
  providers: [BoardsService, BotsService, IdService, ValidatorService]
})
export class AppModule {}
