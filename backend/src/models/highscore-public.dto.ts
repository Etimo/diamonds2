import { ApiProperty } from "@nestjs/swagger";
import { IHighscore } from "../types";

export class HighscorePublicDto {
  @ApiProperty()
  botName: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  seasonId: string;

  @ApiProperty()
  teamLogotype: string;

  public static fromEntity(entity: IHighscore): HighscorePublicDto {
    return {
      botName: entity.bot.name,
      score: entity.score,
      seasonId: entity.seasonId,
      teamLogotype: entity.bot.team.logotypeUrl,
    };
  }
}
