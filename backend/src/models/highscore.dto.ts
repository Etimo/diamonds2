import { ApiProperty } from '@nestjs/swagger';
import { HighScoreEntity } from '../db/models/highScores.entity';

export class HighscoreDto {
  @ApiProperty()
  botName: string;
  @ApiProperty()
  score: number;
  @ApiProperty()
  seasonId: string;

  public static from(dto: Partial<HighscoreDto>) {
    const highScoreObj = new HighscoreDto();
    highScoreObj.botName = dto.botName;
    highScoreObj.score = dto.score;
    highScoreObj.seasonId = dto.seasonId;
    return highScoreObj;
  }

  public static fromEntity(entity: HighScoreEntity) {
    return this.from({
      botName: entity.botName,
      score: entity.score,
      seasonId: entity.seasonId,
    });
  }
}
