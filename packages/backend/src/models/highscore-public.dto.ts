import { IHighscoreDto } from "@etimo/diamonds2-types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IHighscore } from "../types/index.ts";

export class HighscorePublicDto implements IHighscoreDto {
  @ApiProperty()
  botName!: string;

  @ApiProperty()
  score!: number;

  @ApiProperty()
  seasonId!: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  team: string | null = null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  teamLogotype: string | null = null;

  public static fromEntity(entity: IHighscore): HighscorePublicDto {
    return {
      botName: entity.bot!.name,
      score: entity.score,
      seasonId: entity.seasonId,
      team: entity.bot!.team?.name ?? null,
      teamLogotype: entity.bot!.team?.logotypeUrl ?? null,
    };
  }
}
