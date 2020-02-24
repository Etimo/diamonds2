import { BotsService } from "./bots.service";
import { IdService } from "./id.service";
import ConflictError from "../errors/conflict.error";
import { IBot } from "../interfaces/bot.interface";
import { Repository } from "typeorm";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, createConnection } from "typeorm";
import { BotRegistrationPublicDto } from "../models/bot-registration-public.dto";
import { from } from "rxjs";
let service: BotsService;
let connection: Connection;

beforeAll(async () => {
  // const opt = {
  //   ...configService.getTypeOrmConfig(),
  //   debug: true,
  // };
  //TODO: FIX ConnectionOptions from configService.getTypeOrmConfig()
  connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    entities: ["**/*.entity{.ts,.js}"],
  });
  service = new BotsService(connection.getRepository(BotRegistrationsEntity));
});

afterAll(async () => {
  if (connection) {
    await connection.close();
  }
});

beforeEach(async () => {
  await service.delete({
    email: "",
    botName: "bot1",
  });

  await service.delete({
    email: "",
    botName: "bot122",
  });
});

test("Adding bot with same email generates error", async () => {
  const data = {
    email: "hello@world.se",
    botName: "bot1",
  };
  await service.add(data);

  return expect(
    service.add({
      email: data.email,
      botName: "other bot",
    }),
  ).rejects.toBeInstanceOf(ConflictError);
});

test("Adding bot with same name generates error", async () => {
  const data = {
    email: "hello@world.se",
    botName: "bot1",
  };
  await service.add(data);

  return expect(
    service.add({
      email: "other@world.se",
      botName: data.botName,
    }),
  ).rejects.toBeInstanceOf(ConflictError);
});

test("Get bot with token", async () => {
  const data = {
    email: "hel22lo@world.se",
    botName: "bot122",
  };
  const result: BotRegistrationPublicDto = await service.add(data);

  return expect(service.get(result.token)).resolves.toHaveProperty("email");
});
