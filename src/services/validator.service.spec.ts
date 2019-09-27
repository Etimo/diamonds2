import { ValidatorService } from "./validator.service";

let service: ValidatorService;

describe("ValidatorService", () => {
  beforeEach(async () => {
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
});
