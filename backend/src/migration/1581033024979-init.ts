import { MigrationInterface, QueryRunner } from "typeorm";

export class init1581033024979 implements MigrationInterface {
  name = "init1581033024979";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "bot_registrations" ("token" uuid NOT NULL DEFAULT uuid_generate_v4(), "botName" character varying(300) NOT NULL, "email" character varying(300) NOT NULL, "createTimeStamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updateTimeStamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_9ada6b90026027b7d2f75c4d3d8" PRIMARY KEY ("token"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "high_scores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "botName" character varying(300) NOT NULL, "score" integer NOT NULL, "createTimeStamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updateTimeStamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_da1bb900eb93df2f2d5103d8545" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "high_scores"`, undefined);
    await queryRunner.query(`DROP TABLE "bot_registrations"`, undefined);
  }
}
