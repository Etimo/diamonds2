import { MigrationInterface, QueryRunner } from "typeorm";

export class highscores1574430081438 implements MigrationInterface {
  name = "highscores1574430081438";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "high_scores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "botName" character varying(300) NOT NULL, "score" integer NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_da1bb900eb93df2f2d5103d8545" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "high_scores"`, undefined);
  }
}
