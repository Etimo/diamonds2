import { ApiModelProperty } from "@nestjs/swagger";
import { Bot, HighScore } from "@prisma/client";
import { HighScoreEntity } from "../db/models/highScores.entity";

export class HighscoreDto {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  score: number;
  @ApiModelProperty()
  seasonId: string;

  public static from(dto: Partial<HighscoreDto>) {
    const highScoreObj = new HighscoreDto();
    highScoreObj.name = dto.name;
    highScoreObj.score = dto.score;
    highScoreObj.seasonId = dto.seasonId;
    return highScoreObj;
  }

  public static fromEntity(entity: HighScore & { bot: Bot }) {
    return this.from({
      name: entity.bot.name,
      score: entity.score,
      seasonId: entity.seasonId,
    });
  }
}
