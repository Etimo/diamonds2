import { isLocal } from "./environment";

test("Confirms environment is local", () => {
  process.env["ENVIRONMENT"] = "development";
  expect(isLocal()).toBeTruthy();
});

test("Confirms environment is not local", () => {
  process.env["ENVIRONMENT"] = "production";
  expect(isLocal()).toBeFalsy();
});
