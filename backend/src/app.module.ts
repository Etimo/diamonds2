import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { BoardsController } from './controllers/boards.controller';
import { BotsController } from './controllers/bots.controller';
import { HighscoresController } from './controllers/highscores.controller';
import { RecordingsController } from './controllers/recordings.controller';
import { SeasonsController } from './controllers/seasons.controller';
import { SlackController } from './controllers/slack.controller';
import { TeamsController } from './controllers/teams.controller';
import { DatabaseModule } from './database.module';
import { BoardConfigEntity } from './db/models/boardConfig.entity';
import { BotRegistrationsEntity } from './db/models/botRegistrations.entity';
import { HighScoreEntity } from './db/models/highScores.entity';
import { RecordingsEntity } from './db/models/recordings.entity';
import { SeasonsEntity } from './db/models/seasons.entity';
import { TeamsEntity } from './db/models/teams.entity';
import { HighscoresRepository } from './db/repositories/highscores.repository';
import { RecordingsRepository } from './db/repositories/recordings.repository';
import { CustomLogger } from './logger';
import { BoardConfigService } from './services/board-config.service';
import { BoardsService } from './services/board.service';
import { BotsService } from './services/bots.service';
import { HighScoresService } from './services/high-scores.service';
import { RecordingsService } from './services/recordings.service';
import { SeasonsService } from './services/seasons.service';
import { SlackService } from './services/slack.service';
import { TeamsService } from './services/teams.service';
import { repositoryProviders } from './repository.providers';
import { AuthorizationService } from './services/authorization.service';

const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env['TYPEORM_HOST'],
  port: parseInt(process.env['TYPEORM_PORT']),
  username: process.env['TYPEORM_USERNAME'],
  password: process.env['TYPEORM_PASSWORD'],
  database: process.env['TYPEORM_DATABASE'],
  synchronize: process.env['ENVIRONMENT'] === 'development',
  entities: [
    HighScoreEntity,
    BotRegistrationsEntity,
    SeasonsEntity,
    TeamsEntity,
    RecordingsEntity,
    BoardConfigEntity,
  ],
  migrationsTableName: 'migration',
  migrations: ['dist/migration/*.{ts,js}'],
  ssl: false,
};

@Module({
  controllers: [
    BoardsController,
    BotsController,
    HighscoresController,
    RecordingsController,
    SeasonsController,
    SlackController,
    TeamsController,
  ],
  imports: [
    DatabaseModule,
    // TypeOrmModule.forRoot(dbConfig),

    // TypeOrmModule.forFeature([
    //   HighScoreEntity,
    //   BotRegistrationsEntity,
    //   SeasonsEntity,
    //   TeamsEntity,
    //   RecordingsEntity,
    //   BoardConfigEntity,
    // ]),
  ],
  providers: [
    ...repositoryProviders,
    BoardsService,
    HighScoresService,
    BotsService,
    RecordingsService,
    SeasonsService,
    SlackService,
    TeamsService,
    BoardConfigService,
    CustomLogger,
    HighscoresRepository,
    RecordingsRepository,
    AuthorizationService,
    {
      provide: 'NUMBER_OF_BOARDS',
      useValue: 4,
    },
  ],
})
export class AppModule {}
