import { MigrationInterface, QueryRunner } from "typeorm";

export class addPassword1593585305080 implements MigrationInterface {
  name = "addPassword1593585305080";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Deleting all "old" bots. They have to register them again with a password.
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from("bot_registrations")
      .execute();

    await queryRunner.query(
      `ALTER TABLE "bot_registrations" ADD "password" character varying(300) NOT NULL`,
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
