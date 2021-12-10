import { MigrationInterface, QueryRunner } from "typeorm";

export class addBoardConfig1639053577477 implements MigrationInterface {
  name = "addBoardConfig1639053577477";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "board_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "seasonId" uuid NOT NULL, "inventorySize" integer NOT NULL DEFAULT 5, "canTackle" boolean NOT NULL DEFAULT false, "teleporters" integer NOT NULL DEFAULT 1, "teleportRelocation" integer NOT NULL DEFAULT 10, "height" integer NOT NULL DEFAULT 15, "width" integer NOT NULL DEFAULT 15, "minimumDelayBetweenMoves" integer NOT NULL DEFAULT 100, "sessionLength" integer NOT NULL DEFAULT 60, "createTimeStamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updateTimeStamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_1636b437b1255b668e371bc8e23" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "board_config"`, undefined);
  }
}
