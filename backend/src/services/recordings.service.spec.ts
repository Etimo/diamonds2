import { RecordingsService } from "./recordings.service";
import SilentLogger from "../gameengine/util/silent-logger";

describe("RecordingsService", () => {
  let recordingsService: RecordingsService;
  const maxStates = 3;

  beforeEach(async () => {
    recordingsService = new RecordingsService(null, new SilentLogger());
    recordingsService.setup(1, maxStates);
  });

  it("should return empty recording", () => {
    const res = recordingsService.getRecording(0);

    expect(res).toEqual([]);
  });

  it("should record state", () => {
    recordingsService.record(0, "Hello");

    const res = recordingsService.getRecording(0);

    expect(res).toEqual(["Hello"]);
  });

  it("should record in rolling window", () => {
    for (let i = 0; i < maxStates + 1; i++) {
      recordingsService.record(0, i);
    }

    const res = recordingsService.getRecording(0);

    expect(res).toEqual([1, 2, 3]);
  });
});
