import { BotsService } from "./bots.service";
import { IdService } from "./id.service";
import ConflictError from "../errors/conflict.error";
import { IBot } from "../interfaces/bot.interface";

let service: BotsService;

beforeEach(() => {
  service = new BotsService(new IdService());
});

test("Adding bot with same email generates error", async () => {
  const data = {
    email: "hello@world.se",
    name: "bot1",
  };
  await service.add(data);

  return expect(
    service.add({
      email: data.email,
      name: "other bot",
    }),
  ).rejects.toBeInstanceOf(ConflictError);
});

test("Adding bot with same name generates error", async () => {
  const data = {
    email: "hello@world.se",
    name: "bot1",
  };
  await service.add(data);

  return expect(
    service.add({
      email: "other@world.se",
      name: data.name,
    }),
  ).rejects.toBeInstanceOf(ConflictError);
});

test("Get bot with token", async () => {
  const data = {
    email: "hello@world.se",
    name: "bot1",
  };
  const result: IBot = await service.add(data);

  return expect(service.get(result.token)).resolves.toHaveProperty("email");
});
