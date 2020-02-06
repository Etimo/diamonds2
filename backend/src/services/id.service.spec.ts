import { IdService } from "./id.service";

let service: IdService;

beforeEach(() => {
  service = new IdService();
});

test("Generates string", () => {
  expect(service.next()).toBeDefined();
});

test("Generates different strings", () => {
  expect(service.next()).not.toEqual(service.next());
});
