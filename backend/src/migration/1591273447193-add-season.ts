import { MigrationInterface, QueryRunner } from "typeorm";

export class addSeason1591273447193 implements MigrationInterface {
  name = "addSeason1591273447193";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("seasons")
      .values({
        name: "Off season",
        startDate: new Date(),
        endDate: new Date(),
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
