import { beforeEach, describe, expect, it } from "@jest/globals";
import { ValidatorService } from "./validator.service";

let service: ValidatorService;

beforeEach(() => {
  service = new ValidatorService();
});

describe("isValidEmail", () => {
  it("should validate valid email", () => {
    expect(service.isValidEmail("aa@bb.se")).toBeTruthy();
  });

  it("should not validate invalid email", () => {
    expect(service.isValidEmail("aabb.se")).toBeFalsy();
  });
});

describe("isValidName", () => {
  it("should not validate empty string", () => {
    expect(service.isValidName("")).toBeFalsy();
  });

  it("should validate string with at least 1 character", () => {
    expect(service.isValidName("a")).toBeTruthy();
  });
});
