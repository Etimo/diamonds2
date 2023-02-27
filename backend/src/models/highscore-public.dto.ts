import { ApiProperty } from "@nestjs/swagger";

export class HighscorePublicDto {
  @ApiProperty()
  botName: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  seasonId: string;

  @ApiProperty()
  teamLogotype: string;

  // public static from(dto: Partial<HighscorePublicDto>) {
  //   const highScoreObj = new HighscorePublicDto();
  //   highScoreObj.botName = dto.botName;
  //   highScoreObj.score = dto.score;
  //   highScoreObj.seasonId = dto.seasonId;
  //   highScoreObj.teamLogotype = dto.teamLogotype ? dto.teamLogotype : null;
  //   return highScoreObj;
  // }

  // public static fromEntity(
  //   data: Highscore & { bot: Bot; team: { logotypeUrl: string } },
  // ) {
  //   // Used by allBySeasonId in hishscore service
  //   // Data includes raw data from highScore table and teams table.
  //   return this.from({
  //     botName: data.bot.name,
  //     score: data.score,
  //     seasonId: data.seasonId,
  //     teamLogotype: data.team.logotypeUrl,
  //   });
  // }
}
