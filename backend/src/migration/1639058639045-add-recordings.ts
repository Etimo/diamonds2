import { MigrationInterface, QueryRunner } from "typeorm";

export class addRecordings1639058639045 implements MigrationInterface {
  name = "addRecordings1639058639045";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recordings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "botName" character varying(300) NOT NULL, "score" integer NOT NULL, "board" integer NOT NULL, "seasonId" uuid, "createTimeStamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "recording" text NOT NULL, CONSTRAINT "PK_8c3247d5ee4551d59bb2115a484" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "recordings"`, undefined);
  }
}
