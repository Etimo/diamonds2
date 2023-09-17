import { ApiProperty } from "@nestjs/swagger";

export class HighscoreDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  score!: number;

  @ApiProperty()
  seasonId!: string;

  // public static from(dto: Partial<HighscoreDto>) {
  //   const highScoreObj = new HighscoreDto();
  //   highScoreObj.name = dto.name;
  //   highScoreObj.score = dto.score;
  //   highScoreObj.seasonId = dto.seasonId;
  //   return highScoreObj;
  // }

  // public static fromEntity(entity: Highscore & { bot: Bot }) {
  //   return this.from({
  //     name: entity.bot.name,
  //     score: entity.score,
  //     seasonId: entity.seasonId,
  //   });
  // }
}
