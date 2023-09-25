import { IHighscoreDto } from "@etimo/diamonds2-types";
import { ApiProperty } from "@nestjs/swagger";
import { IHighscore } from "../types";

export class HighscorePublicDto implements IHighscoreDto {
  @ApiProperty()
  botName!: string;

  @ApiProperty()
  score!: number;

  @ApiProperty()
  seasonId!: string;

  @ApiProperty()
  team!: string;

  @ApiProperty()
  teamLogotype!: string;

  public static fromEntity(entity: IHighscore): HighscorePublicDto {
    return {
      botName: entity.bot!.name,
      score: entity.score,
      seasonId: entity.seasonId,
      team: entity.bot!.team!.name,
      teamLogotype: entity.bot!.team!.logotypeUrl,
    };
  }
}
