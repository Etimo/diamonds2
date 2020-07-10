import { MigrationInterface, QueryRunner } from "typeorm";

export class etimoTeam1594374031418 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const team = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("teams")
      .values({
        abbreviation: "etimo",
        name: "Etimo",
        logotypeUrl:
          "https://etimo.se/static/564f0f6e1560864c9cd98c9e514b07a6/69585/etimo-logo.png",
      })
      .execute();

    console.log(team);
    // maybe need to fetch the team
    await queryRunner.manager
      .createQueryBuilder()
      .update("bot_registrations")
      .where("botName = :nameOne OR botName = :nameTwo", {
        nameOne: "etimo1",
        nameTwo: "etimo2",
      })
      .set({
        team: team["raw"][0]["id"],
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from("high_scores")
      .where("abbreviation = :abbreviation", {
        abbreviation: "etimo",
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .update("bot_registrations")
      .where("botName = :nameOne OR botName = :nameTwo", {
        nameOne: "etimo1",
        nameTwo: "etimo2",
      })
      .set({
        team: null,
      })
      .execute();
  }
}
