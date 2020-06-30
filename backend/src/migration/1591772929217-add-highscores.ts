import { MigrationInterface, QueryRunner } from "typeorm";

export class addHighscores1591772929217 implements MigrationInterface {
  name = "addHighscores1591772929217";
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update current highscores to season 2020
    const seasons = await this.getAllSeasons(queryRunner);
    const season = seasons.find(season => season.name === "Linköping VT 2020");
    await queryRunner.manager
      .createQueryBuilder()
      .update("high_scores")
      .set({
        seasonId: season.id,
      })
      .execute();

    // Add old highscores to db
    const season2017 = seasons.find(
      season => season.name === "Linköping VT 2017",
    );
    const highScores2017 = require("../data/2017-highscores.json");
    await this.addOldHighScores(queryRunner, highScores2017, season2017);

    const season2018 = seasons.find(
      season => season.name === "Linköping VT 2018",
    );
    const highScores2018 = require("../data/2018-highscores.json");
    await this.addOldHighScores(queryRunner, highScores2018, season2018);

    const season2019 = seasons.find(
      season => season.name === "Linköping VT 2019",
    );
    const highScores2019 = require("../data/2019-highscores.json");
    await this.addOldHighScores(queryRunner, highScores2019, season2019);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const seasons = await this.getAllSeasons(queryRunner);

    // Delete old highscores from db
    const season2017 = seasons.find(
      season => season.name === "Linköping VT 2017",
    );
    const highScores2017 = require("../data/2017-highscores.json");
    await this.deleteOldHighScores(queryRunner, highScores2017, season2017);

    const season2018 = seasons.find(
      season => season.name === "Linköping VT 2018",
    );
    const highScores2018 = require("../data/2018-highscores.json");
    await this.deleteOldHighScores(queryRunner, highScores2018, season2018);

    const season2019 = seasons.find(
      season => season.name === "Linköping VT 2019",
    );
    const highScores2019 = require("../data/2019-highscores.json");
    await this.deleteOldHighScores(queryRunner, highScores2019, season2019);

    // Remove season id from 2020 highscores
    await queryRunner.manager
      .createQueryBuilder()
      .update("high_scores")
      .set({
        seasonId: null,
      })
      .execute();
  }

  private async getAllSeasons(queryRunner) {
    return await queryRunner.query("SELECT * FROM seasons");
  }

  private async addOldHighScores(queryRunner, highScores, season) {
    highScores.forEach(async highscore => {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into("high_scores")
        .values({
          botName: highscore.BotName,
          score: highscore.Score,
          seasonId: season.id,
        })
        .execute();
    });
  }

  private async deleteOldHighScores(queryRunner, highScores, season) {
    highScores.forEach(async highscore => {
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from("high_scores")
        .where("botName = :botName AND seasonId = :seasonId", {
          botName: highscore.BotName,
          seasonId: season.id,
        })
        .execute();
    });
  }
}
