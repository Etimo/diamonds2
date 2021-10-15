export class HighscorePrivateDto {
  botName: string;
  score: number;
  email: string;

  public static from(dto: Partial<HighscorePrivateDto>) {
    const highScoreObj = new HighscorePrivateDto();
    highScoreObj.botName = dto.botName;
    highScoreObj.score = dto.score;
    highScoreObj.email = dto.email;
    return highScoreObj;
  }

  public static fromRawDataObject(data: {}) {
    // Used by allBySeasonId in hishscore service
    // Data includes raw data from highScore table and teams table.
    return this.from({
      botName: data["highScores_botName"],
      score: data["highScores_score"],
      email: data["bot_email"],
    });
  }
}
