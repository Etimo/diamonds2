-- CreateTable
CREATE TABLE "BoardConfig" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "inventorySize" INTEGER NOT NULL DEFAULT 5,
    "canTackle" BOOLEAN NOT NULL DEFAULT false,
    "teleporters" INTEGER NOT NULL DEFAULT 1,
    "teleportRelocation" INTEGER NOT NULL DEFAULT 10,
    "height" INTEGER NOT NULL DEFAULT 15,
    "width" INTEGER NOT NULL DEFAULT 15,
    "minimumDelayBetweenMoves" INTEGER NOT NULL DEFAULT 100,
    "sessionLength" INTEGER NOT NULL DEFAULT 60,
    "createTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_1636b437b1255b668e371bc8e23" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bot" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(300) NOT NULL,
    "email" VARCHAR(300) NOT NULL,
    "createTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" VARCHAR(300),
    "teamId" UUID NOT NULL,

    CONSTRAINT "PK_9ada6b90026027b7d2f75c4d3d8" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Highscore" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "score" INTEGER NOT NULL,
    "createTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seasonId" UUID NOT NULL,
    "botId" UUID NOT NULL,

    CONSTRAINT "PK_da1bb900eb93df2f2d5103d8545" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "score" INTEGER NOT NULL,
    "board" INTEGER NOT NULL,
    "createTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recording" TEXT NOT NULL,
    "seasonId" UUID NOT NULL,
    "botId" UUID NOT NULL,

    CONSTRAINT "PK_8c3247d5ee4551d59bb2115a484" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(300) NOT NULL,
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "createTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardConfigId" UUID NOT NULL,

    CONSTRAINT "PK_cb8ed53b5fe109dcd4a4449ec9d" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(300) NOT NULL,
    "abbreviation" VARCHAR(20) NOT NULL,
    "logotypeUrl" VARCHAR(1000) NOT NULL,
    "createTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTimeStamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bot_name_key" ON "Bot"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bot_email_key" ON "Bot"("email");

-- CreateIndex
CREATE INDEX "Highscore_seasonId_botId_idx" ON "Highscore"("seasonId", "botId");

-- CreateIndex
CREATE UNIQUE INDEX "Highscore_seasonId_botId_key" ON "Highscore"("seasonId", "botId");

-- CreateIndex
CREATE UNIQUE INDEX "Season_name_key" ON "Season"("name");

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highscore" ADD CONSTRAINT "Highscore_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highscore" ADD CONSTRAINT "Highscore_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_boardConfigId_fkey" FOREIGN KEY ("boardConfigId") REFERENCES "BoardConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
