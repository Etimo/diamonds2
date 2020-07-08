import { MigrationInterface, QueryRunner } from "typeorm";

export class addPassword1594193920785 implements MigrationInterface {
  name = "addPassword1594193920785";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bot_registrations" ADD "password" character varying(300)`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bot_registrations" DROP COLUMN "password"`,
      undefined,
    );
  }
}
