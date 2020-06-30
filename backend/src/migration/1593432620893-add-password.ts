import { MigrationInterface, QueryRunner } from "typeorm";

export class addPassword1593432620893 implements MigrationInterface {
  name = "addPassword1593432620893";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bot_registrations" ADD "password" character varying`,
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
