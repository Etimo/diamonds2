import { ApiModelProperty } from "@nestjs/swagger";
import { HighScoreEntity } from "../db/models/highScores.entity";

export class HighscoreDto {
  @ApiModelProperty()
  botName: string;
  @ApiModelProperty()
  score: number;
  @ApiModelProperty()
  seasonId: string;
  @ApiModelProperty()
  teamLogotype?: string;

  public static from(dto: Partial<HighscoreDto>) {
    const highScoreObj = new HighscoreDto();
    highScoreObj.botName = dto.botName;
    highScoreObj.score = dto.score;
    highScoreObj.seasonId = dto.seasonId;
    highScoreObj.teamLogotype = dto.teamLogotype ? dto.teamLogotype : null;
    return highScoreObj;
  }

  public static fromEntity(entity: HighScoreEntity) {
    return this.from({
      botName: entity.botName,
      score: entity.score,
      seasonId: entity.seasonId,
    });
  }

  public static fromRawDataObject(data: {}) {
    // Used by allBySeasonId in hishscore service
    // Data includes raw data from highScore table and teams table.
    return this.from({
      botName: data["highScores_botName"],
      score: data["highScores_score"],
      seasonId: data["highScores_seasonId"],
      teamLogotype: data["teams_logotypeUrl"],
    });
  }
}
