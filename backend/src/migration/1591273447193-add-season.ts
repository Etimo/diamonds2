import { MigrationInterface, QueryRunner } from "typeorm";

export class addSeason1591273447193 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
