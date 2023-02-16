import { DataSource } from 'typeorm';
import { BoardConfigEntity } from './db/models/boardConfig.entity';
import { BotRegistrationsEntity } from './db/models/botRegistrations.entity';
import { HighScoreEntity } from './db/models/highScores.entity';
import { RecordingsEntity } from './db/models/recordings.entity';
import { SeasonsEntity } from './db/models/seasons.entity';
import { TeamsEntity } from './db/models/teams.entity';

export const repositoryProviders = [
  {
    provide: 'BOT_REGISTRATIONS',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(BotRegistrationsEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'BOARD_CONFIGS',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(BoardConfigEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'HIGHSCORES',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(HighScoreEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'RECORDINGS',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RecordingsEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'SEASONS',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SeasonsEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'TEAMS',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TeamsEntity),
    inject: ['DATA_SOURCE'],
  },
];
