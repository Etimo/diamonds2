import { MigrationInterface, QueryRunner } from "typeorm";

export class addOffSeasonBoardConfig1639053743945
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const offSeason = await this.getAllSeasons(queryRunner);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("board_config")
      .values({
        seasonId: offSeason.id,
        inventorySize: 5,
        canTackle: false,
        teleporters: 1,
        teleportRelocation: 10,
        height: 15,
        width: 15,
        minimumDelayBetweenMoves: 100,
        sessionLength: 60,
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const offSeason = await this.getAllSeasons(queryRunner);
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from("board_config")
      .where("seasonId = :seasonId", {
        seasonId: offSeason.id,
      })
      .execute();
  }

  private async getAllSeasons(queryRunner) {
    const seasons = await queryRunner.query("SELECT * FROM seasons");
    return seasons.find(season => season.name === "Off season");
  }
}
