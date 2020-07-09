import { MigrationInterface, QueryRunner } from "typeorm";

export class addTeams1594284894458 implements MigrationInterface {
  name = "addTeams1594284894458";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(300) NOT NULL, "abbreviation" character varying(20) NOT NULL, "logotypeUrl" character varying(1000) NOT NULL, "createTimeStamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updateTimeStamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "bot_registrations" ADD "team" uuid`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bot_registrations" DROP COLUMN "team"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "teams"`, undefined);
  }
}
