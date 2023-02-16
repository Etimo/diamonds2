import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.season.deleteMany();
  await prisma.boardConfig.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.team.deleteMany();
  await prisma.highScore.deleteMany();

  const zeroUuid = "00000000-0000-0000-0000-000000000000";

  const team = await prisma.team.create({
    data: {
      name: "Etimo",
      abbreviation: "etimo",
      logotypeUrl:
        "https://etimo-diamonds.s3.eu-north-1.amazonaws.com/images/etimoLogo.png",
    },
  });

  const bot1 = await prisma.bot.create({
    data: {
      email: "etimo1@etimo.se",
      name: "Etimo1",
      teamId: team.id,
      token: "1a567a03-3272-426b-8828-98807d1551bf",
    },
  });
  const bot2 = await prisma.bot.create({
    data: {
      email: "etimo2@etimo.se",
      name: "Etimo2",
      teamId: team.id,
      token: "47046ef2-f56b-4588-b951-deb2ab127aa2",
    },
  });

  const season = await prisma.season.create({
    data: {
      name: "Off season",
      id: zeroUuid,
      startDate: "2020-01-01T00:00:00Z",
      endDate: "2030-01-01T00:00:00Z",
      boardConfig: {
        create: {
          canTackle: true,
          height: 15,
          width: 15,
          inventorySize: 5,
          sessionLength: 60,
          teleporters: 1,
          minimumDelayBetweenMoves: 100,
          teleportRelocation: 30,
        },
      },
    },
  });

  await prisma.highScore.createMany({
    data: [
      { botToken: bot1.token, score: 34, seasonId: season.id },
      { botToken: bot2.token, score: 31, seasonId: season.id },
    ],
  });
};

main().then(async _ => {
  await prisma.$disconnect();
  console.log("Done");
});
