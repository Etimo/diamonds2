import * as _ from "lodash";
import { createConnection, ConnectionOptions } from "typeorm";
import { configService } from "../config/config.service";
import { HighScoresService } from "../services/high-scores.service";
import { HighScoreEntity } from "../db/models/highScores.entity";
import { HighscoreDto } from "../models/highscore.dto";

async function run() {
  // const seedUser: User = { id: "seed-user" };

  const seedId = Date.now()
    .toString()
    .split("")
    .reverse()
    .reduce((s, it, x) => (x > 3 ? s : (s += it)), "");

  const opt = {
    ...configService.getTypeOrmConfig(),
    debug: true,
  };

  const connection = await createConnection(opt as ConnectionOptions);
  const highScoresService = new HighScoresService(
    connection.getRepository(HighScoreEntity),
  );

  const work = _.range(1, 10)

    .map(n =>
      HighscoreDto.from({
        botName: `BotSeed${seedId}-${n}`,
        score: n * 3,
      }),
    )
    .map(dto =>
      highScoresService
        .create(dto)
        .then(r => (console.log("done ->", r.botName, r.score), r)),
    );
  connection.close();
  return await Promise.all(work);
}

run()
  .then(_ => console.log("...wait for script to exit"))
  .catch(error => console.error("seed error", error));
