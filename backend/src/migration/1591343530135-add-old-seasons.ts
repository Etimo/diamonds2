import { MigrationInterface, QueryRunner } from "typeorm";

export class addOldSeasons1591343530135 implements MigrationInterface {
  name = "addOldSeasons1591343530135";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("seasons")
      .values({
        name: "Linköping VT 2020",
        startDate: new Date(2020, 2, 1),
        endDate: new Date(2020, 4, 20),
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("seasons")
      .values({
        name: "Linköping VT 2019",
        startDate: new Date(2019, 2, 1),
        endDate: new Date(2019, 4, 20),
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("seasons")
      .values({
        name: "Linköping VT 2018",
        startDate: new Date(2018, 2, 1),
        endDate: new Date(2018, 4, 20),
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("seasons")
      .values({
        name: "Linköping VT 2017",
        startDate: new Date(2017, 2, 1),
        endDate: new Date(2017, 4, 20),
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
