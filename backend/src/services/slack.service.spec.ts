import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { TestingModule } from "@nestjs/testing";
import { ForbiddenError } from "../errors";
import { BoardConfigService } from "./board-config.service";
import { HighscoresService } from "./highscores.service";
import { SeasonsService } from "./seasons.service";
import { SlackService } from "./slack.service";
import { TeamsService } from "./teams.service";
import { createTestModule } from "./test-helper.spec";

describe("SlackService", () => {
  let slackService: SlackService;
  let seasonsService: SeasonsService;
  let teamsService: TeamsService;
  let highScoresService: HighscoresService;
  let boardConfigService: BoardConfigService;

  beforeEach(async () => {
    const module: TestingModule = await createTestModule();
    slackService = module.get<SlackService>(SlackService);
    seasonsService = module.get<SeasonsService>(SeasonsService);
    boardConfigService = module.get<BoardConfigService>(BoardConfigService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(SlackService).toBeDefined();
    expect(SeasonsService).toBeDefined();
    expect(TeamsService).toBeDefined();
    expect(BoardConfigService).toBeDefined();
  });

  //   it("handleInteract, Should return error in slack format", async () => {
  //     const payload = {
  //       payload:
  //         '{"type":"view_submission","team":{"id":"T044B4VDU","domain":"etimo"},"user":{"id":"UNQMJCUBU","username":"philip.forsberg","name":"philip.forsberg","team_id":"T044B4VDU"},"api_app_id":"A016CKNFP6F","token":"9EiOLDyhuUi3LlXQOZbPfVks","trigger_id":"1247562526480.4147165470.3284751d2143c0a6d8489027ee64dd4f","view":{"id":"V0179GJD2TA","team_id":"T044B4VDU","type":"modal","blocks":[{"type":"input","block_id":"season_name","label":{"type":"plain_text","text":"Season name","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","action_id":"jz+H5"}},{"type":"input","block_id":"start_date","label":{"type":"plain_text","text":"Start date","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"datepicker","initial_date":"2021-12-10","action_id":"dHYI1"}},{"type":"input","block_id":"end_date","label":{"type":"plain_text","text":"End date","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"datepicker","initial_date":"2022-01-09","action_id":"+Y0"}},{"type":"input","block_id":"inventory_size","label":{"type":"plain_text","text":"Inventory size","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"5","action_id":"wx5Q"}},{"type":"input","block_id":"can_tackle","label":{"type":"plain_text","text":"Should the bots be able to tackle? (true / false)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"true","action_id":"PRDF"}},{"type":"input","block_id":"teleporters","label":{"type":"plain_text","text":"Number of teleporters","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"1","action_id":"F6z9Q"}},{"type":"input","block_id":"teleport_relocation","label":{"type":"plain_text","text":"How often should the teleporters reposition? (seconds)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"10","action_id":"ibN"}},{"type":"input","block_id":"height","label":{"type":"plain_text","text":"Height of the board (columns)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"15","action_id":"vRWM"}},{"type":"input","block_id":"width","label":{"type":"plain_text","text":"Width of the board (columns)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"15","action_id":"ET8LR"}},{"type":"input","block_id":"minimum_delay_between_moves","label":{"type":"plain_text","text":"How often should the bot be able to move? (milliseconds)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"100","action_id":"Eyig"}},{"type":"input","block_id":"session_length","label":{"type":"plain_text","text":"How long is the game session?","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"60","action_id":"f3P"}}],"private_metadata":"","callback_id":"add-season","state":{"values":{"season_name":{"D790":{"type":"plain_text_input","value":"tst 34242"}},"start_date":{"LebQP":{"type":"datepicker","selected_date":"2026-02-01"}},"end_date":{"0xaa":{"type":"datepicker","selected_date":"2026-02-03"}},"inventory_size":{"+SV9":{"type":"plain_text_input","value":"5"}},"can_tackle":{"Kwn0":{"type":"plain_text_input","value":"true"}},"teleporters":{"2QUY":{"type":"plain_text_input","value":"1"}},"teleport_relocation":{"0LI":{"type":"plain_text_input","value":"10"}},"height":{"fAJa":{"type":"plain_text_input","value":"15"}},"width":{"Z6pv=":{"type":"plain_text_input","value":"15"}},"minimum_delay_between_moves":{"Ykcy":{"type":"plain_text_input","value":"100"}},"session_length":{"wNTo":{"type":"plain_text_input","value":"60"}}}}},"hash":"1594018450.CovdWvl7","title":{"type":"plain_text","text":"Add season","emoji":true},"clear_on_close":false,"notify_on_close":false,"close":{"type":"plain_text","text":"Cancel","emoji":true},"submit":{"type":"plain_text","text":"Submit","emoji":true},"previous_view_id":null,"root_view_id":"V0179GJD2TA","app_id":"A016CKNFP6F","external_id":"","app_installed_team_id":"T044B4VDU","bot_id":"B0172AHQ8QG"}',
  //     };
  //
  //     // Mocking addSeason to throw error
  //     seasonsRepositoryMock.create.mockImplementation(() => throwException());
  //     //spyOn<any>(seasonsService, "add").and.callFake(() => throwException());
  //
  //     await expect(slackService.handleInteract(payload)).resolves.toHaveProperty(
  //       "errors.start_date",
  //     );
  //   });

  it("handleInteract, Invalid callback_id.", async () => {
    const payload = {
      payload:
        '{"type":"view_submission","team":{"id":"T044B4VDU","domain":"etimo"},"user":{"id":"UNQMJCUBU","username":"philip.forsberg","name":"philip.forsberg","team_id":"T044B4VDU"},"api_app_id":"A016CKNFP6F","token":"9EiOLDyhuUi3LlXQOZbPfVks","trigger_id":"1247562526480.4147165470.3284751d2143c0a6d8489027ee64dd4f","view":{"id":"V0179GJD2TA","team_id":"T044B4VDU","type":"modal","blocks":[{"type":"input","block_id":"season_name","label":{"type":"plain_text","text":"Season name","emoji":true},"optional":false,"element":{"type":"plain_text_input","action_id":"Hx6W"}},{"type":"input","block_id":"start_date","label":{"type":"plain_text","text":"Start date","emoji":true},"optional":false,"element":{"type":"datepicker","initial_date":"2020-07-06","placeholder":{"type":"plain_text","text":"Select a date","emoji":true},"action_id":"7Lg5"}},{"type":"input","block_id":"end_date","label":{"type":"plain_text","text":"End date","emoji":true},"optional":false,"element":{"type":"datepicker","initial_date":"2020-08-05","placeholder":{"type":"plain_text","text":"Select a date","emoji":true},"action_id":"OVme"}}],"private_metadata":"","callback_id":"add-asd","state":{"values":{"start_date":{"7Lg5":{"type":"datepicker","selected_date":"2020-07-06"}},"end_date":{"OVme":{"type":"datepicker","selected_date":"2020-08-05"}},"season_name":{"Hx6W":{"type":"plain_text_input","value":"asd"}}}},"hash":"1594018450.CovdWvl7","title":{"type":"plain_text","text":"Add season","emoji":true},"clear_on_close":false,"notify_on_close":false,"close":{"type":"plain_text","text":"Cancel","emoji":true},"submit":{"type":"plain_text","text":"Submit","emoji":true},"previous_view_id":null,"root_view_id":"V0179GJD2TA","app_id":"A016CKNFP6F","external_id":"","app_installed_team_id":"T044B4VDU","bot_id":"B0172AHQ8QG"},"response_urls":[]}',
    };

    await expect(slackService.handleInteract(payload)).rejects.toThrowError(
      ForbiddenError,
    );
  });

  //   it("handleInteract, Season is added, return undefined", async () => {
  //     const payload = {
  //       payload:
  //         '{"type":"view_submission","team":{"id":"T044B4VDU","domain":"etimo"},"user":{"id":"UNQMJCUBU","username":"philip.forsberg","name":"philip.forsberg","team_id":"T044B4VDU"},"api_app_id":"A016CKNFP6F","token":"9EiOLDyhuUi3LlXQOZbPfVks","trigger_id":"1247562526480.4147165470.3284751d2143c0a6d8489027ee64dd4f","view":{"id":"V0179GJD2TA","team_id":"T044B4VDU","type":"modal","blocks":[{"type":"input","block_id":"season_name","label":{"type":"plain_text","text":"Season name","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","action_id":"jz+H5"}},{"type":"input","block_id":"start_date","label":{"type":"plain_text","text":"Start date","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"datepicker","initial_date":"2021-12-10","action_id":"dHYI1"}},{"type":"input","block_id":"end_date","label":{"type":"plain_text","text":"End date","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"datepicker","initial_date":"2022-01-09","action_id":"+Y0"}},{"type":"input","block_id":"inventory_size","label":{"type":"plain_text","text":"Inventory size","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"5","action_id":"wx5Q"}},{"type":"input","block_id":"can_tackle","label":{"type":"plain_text","text":"Should the bots be able to tackle? (true / false)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"true","action_id":"PRDF"}},{"type":"input","block_id":"teleporters","label":{"type":"plain_text","text":"Number of teleporters","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"1","action_id":"F6z9Q"}},{"type":"input","block_id":"teleport_relocation","label":{"type":"plain_text","text":"How often should the teleporters reposition? (seconds)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"10","action_id":"ibN"}},{"type":"input","block_id":"height","label":{"type":"plain_text","text":"Height of the board (columns)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"15","action_id":"vRWM"}},{"type":"input","block_id":"width","label":{"type":"plain_text","text":"Width of the board (columns)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"15","action_id":"ET8LR"}},{"type":"input","block_id":"minimum_delay_between_moves","label":{"type":"plain_text","text":"How often should the bot be able to move? (milliseconds)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"100","action_id":"Eyig"}},{"type":"input","block_id":"session_length","label":{"type":"plain_text","text":"How long is the game session?","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"60","action_id":"f3P"}}],"private_metadata":"","callback_id":"add-season","state":{"values":{"season_name":{"D790":{"type":"plain_text_input","value":"tst 34242"}},"start_date":{"LebQP":{"type":"datepicker","selected_date":"2026-02-01"}},"end_date":{"0xaa":{"type":"datepicker","selected_date":"2026-02-03"}},"inventory_size":{"+SV9":{"type":"plain_text_input","value":"5"}},"can_tackle":{"Kwn0":{"type":"plain_text_input","value":"true"}},"teleporters":{"2QUY":{"type":"plain_text_input","value":"1"}},"teleport_relocation":{"0LI":{"type":"plain_text_input","value":"10"}},"height":{"fAJa":{"type":"plain_text_input","value":"15"}},"width":{"Z6pv=":{"type":"plain_text_input","value":"15"}},"minimum_delay_between_moves":{"Ykcy":{"type":"plain_text_input","value":"100"}},"session_length":{"wNTo":{"type":"plain_text_input","value":"60"}}}}},"hash":"1594018450.CovdWvl7","title":{"type":"plain_text","text":"Add season","emoji":true},"clear_on_close":false,"notify_on_close":false,"close":{"type":"plain_text","text":"Cancel","emoji":true},"submit":{"type":"plain_text","text":"Submit","emoji":true},"previous_view_id":null,"root_view_id":"V0179GJD2TA","app_id":"A016CKNFP6F","external_id":"","app_installed_team_id":"T044B4VDU","bot_id":"B0172AHQ8QG"}',
  //     };

  //     seasonsRepositoryMock.create.mockResolvedValue({
  //       id: "123",
  //       name: "test",
  //       startDate: new Date(),
  //       endDate: new Date(),
  //     } as unknown as ISeason);

  //     boardConfigRepositoryMock.create.mockResolvedValue({
  //       id: "test",
  //       seasonId: "321",
  //       inventorySize: 5,
  //       canTackle: false,
  //       teleporters: 1,
  //       teleportRelocation: 10,
  //       height: 15,
  //       width: 15,
  //       minimumDelayBetweenMoves: 100,
  //       sessionLength: 60,
  //       createTimeStamp: new Date(),
  //       updateTimeStamp: new Date(),
  //     } as IBoardConfig);

  //     await expect(slackService.handleInteract(payload)).resolves.toBe(undefined);
  //   });
  //   const throwException = () => {
  //     throw new ConflictError("test", "start_date");
  //   };
  // });

  // describe("SeasonsService", () => {
  //   let slackService: SlackService;
  //   let seasonsService: SeasonsService;
  //   let teamsService: TeamsService;
  //   let highScoresService: HighScoresService;
  //   let boardConfigService: BoardConfigService;

  //   beforeEach(async () => {
  //     slackService = module.get<SlackService>(SlackService);
  //     seasonsService = module.get<SeasonsService>(SeasonsService);
  //     boardConfigService = module.get<BoardConfigService>(BoardConfigService);
  //     jest.clearAllMocks();
  //   });

  //   it("handleInteract, Should return error in slack format", async () => {
  //     const payload = {
  //       payload:
  //         '{"type":"view_submission","team":{"id":"T044B4VDU","domain":"etimo"},"user":{"id":"UNQMJCUBU","username":"philip.forsberg","name":"philip.forsberg","team_id":"T044B4VDU"},"api_app_id":"A016CKNFP6F","token":"9EiOLDyhuUi3LlXQOZbPfVks","trigger_id":"1247562526480.4147165470.3284751d2143c0a6d8489027ee64dd4f","view":{"id":"V0179GJD2TA","team_id":"T044B4VDU","type":"modal","blocks":[{"type":"input","block_id":"season_name","label":{"type":"plain_text","text":"Season name","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","action_id":"jz+H5"}},{"type":"input","block_id":"start_date","label":{"type":"plain_text","text":"Start date","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"datepicker","initial_date":"2021-12-10","action_id":"dHYI1"}},{"type":"input","block_id":"end_date","label":{"type":"plain_text","text":"End date","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"datepicker","initial_date":"2022-01-09","action_id":"+Y0"}},{"type":"input","block_id":"inventory_size","label":{"type":"plain_text","text":"Inventory size","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"5","action_id":"wx5Q"}},{"type":"input","block_id":"can_tackle","label":{"type":"plain_text","text":"Should the bots be able to tackle? (true / false)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"true","action_id":"PRDF"}},{"type":"input","block_id":"teleporters","label":{"type":"plain_text","text":"Number of teleporters","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"1","action_id":"F6z9Q"}},{"type":"input","block_id":"teleport_relocation","label":{"type":"plain_text","text":"How often should the teleporters reposition? (seconds)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"10","action_id":"ibN"}},{"type":"input","block_id":"height","label":{"type":"plain_text","text":"Height of the board (columns)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"15","action_id":"vRWM"}},{"type":"input","block_id":"width","label":{"type":"plain_text","text":"Width of the board (columns)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"15","action_id":"ET8LR"}},{"type":"input","block_id":"minimum_delay_between_moves","label":{"type":"plain_text","text":"How often should the bot be able to move? (milliseconds)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"100","action_id":"Eyig"}},{"type":"input","block_id":"session_length","label":{"type":"plain_text","text":"How long is the game session?","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"60","action_id":"f3P"}}],"private_metadata":"","callback_id":"add-season","state":{"values":{"season_name":{"D790":{"type":"plain_text_input","value":"tst 34242"}},"start_date":{"LebQP":{"type":"datepicker","selected_date":"2026-02-01"}},"end_date":{"0xaa":{"type":"datepicker","selected_date":"2026-02-03"}},"inventory_size":{"+SV9":{"type":"plain_text_input","value":"5"}},"can_tackle":{"Kwn0":{"type":"plain_text_input","value":"true"}},"teleporters":{"2QUY":{"type":"plain_text_input","value":"1"}},"teleport_relocation":{"0LI":{"type":"plain_text_input","value":"10"}},"height":{"fAJa":{"type":"plain_text_input","value":"15"}},"width":{"Z6pv=":{"type":"plain_text_input","value":"15"}},"minimum_delay_between_moves":{"Ykcy":{"type":"plain_text_input","value":"100"}},"session_length":{"wNTo":{"type":"plain_text_input","value":"60"}}}}},"hash":"1594018450.CovdWvl7","title":{"type":"plain_text","text":"Add season","emoji":true},"clear_on_close":false,"notify_on_close":false,"close":{"type":"plain_text","text":"Cancel","emoji":true},"submit":{"type":"plain_text","text":"Submit","emoji":true},"previous_view_id":null,"root_view_id":"V0179GJD2TA","app_id":"A016CKNFP6F","external_id":"","app_installed_team_id":"T044B4VDU","bot_id":"B0172AHQ8QG"}',
  //     };

  //     // Mocking addSeason to throw error
  //     spyOn<any>(seasonsService, "add").and.callFake(() => throwException());

  //     await expect(slackService.handleInteract(payload)).resolves.toHaveProperty(
  //       "errors.start_date",
  //     );
  //   });

  //   const throwException = () => {
  //     throw new ConflictError("test", "start_date");
  //   };

  //   it("handleInteract, Season is added, return undefined", async () => {
  //     const payload = {
  //       payload:
  //         '{"type":"view_submission","team":{"id":"T044B4VDU","domain":"etimo"},"user":{"id":"UNQMJCUBU","username":"philip.forsberg","name":"philip.forsberg","team_id":"T044B4VDU"},"api_app_id":"A016CKNFP6F","token":"9EiOLDyhuUi3LlXQOZbPfVks","trigger_id":"1247562526480.4147165470.3284751d2143c0a6d8489027ee64dd4f","view":{"id":"V0179GJD2TA","team_id":"T044B4VDU","type":"modal","blocks":[{"type":"input","block_id":"season_name","label":{"type":"plain_text","text":"Season name","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","action_id":"jz+H5"}},{"type":"input","block_id":"start_date","label":{"type":"plain_text","text":"Start date","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"datepicker","initial_date":"2021-12-10","action_id":"dHYI1"}},{"type":"input","block_id":"end_date","label":{"type":"plain_text","text":"End date","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"datepicker","initial_date":"2022-01-09","action_id":"+Y0"}},{"type":"input","block_id":"inventory_size","label":{"type":"plain_text","text":"Inventory size","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"5","action_id":"wx5Q"}},{"type":"input","block_id":"can_tackle","label":{"type":"plain_text","text":"Should the bots be able to tackle? (true / false)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"true","action_id":"PRDF"}},{"type":"input","block_id":"teleporters","label":{"type":"plain_text","text":"Number of teleporters","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"1","action_id":"F6z9Q"}},{"type":"input","block_id":"teleport_relocation","label":{"type":"plain_text","text":"How often should the teleporters reposition? (seconds)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"10","action_id":"ibN"}},{"type":"input","block_id":"height","label":{"type":"plain_text","text":"Height of the board (columns)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"15","action_id":"vRWM"}},{"type":"input","block_id":"width","label":{"type":"plain_text","text":"Width of the board (columns)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"15","action_id":"ET8LR"}},{"type":"input","block_id":"minimum_delay_between_moves","label":{"type":"plain_text","text":"How often should the bot be able to move? (milliseconds)","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"100","action_id":"Eyig"}},{"type":"input","block_id":"session_length","label":{"type":"plain_text","text":"How long is the game session?","emoji":true},"optional":false,"dispatch_action":false,"element":{"type":"plain_text_input","initial_value":"60","action_id":"f3P"}}],"private_metadata":"","callback_id":"add-season","state":{"values":{"season_name":{"D790":{"type":"plain_text_input","value":"tst 34242"}},"start_date":{"LebQP":{"type":"datepicker","selected_date":"2026-02-01"}},"end_date":{"0xaa":{"type":"datepicker","selected_date":"2026-02-03"}},"inventory_size":{"+SV9":{"type":"plain_text_input","value":"5"}},"can_tackle":{"Kwn0":{"type":"plain_text_input","value":"true"}},"teleporters":{"2QUY":{"type":"plain_text_input","value":"1"}},"teleport_relocation":{"0LI":{"type":"plain_text_input","value":"10"}},"height":{"fAJa":{"type":"plain_text_input","value":"15"}},"width":{"Z6pv=":{"type":"plain_text_input","value":"15"}},"minimum_delay_between_moves":{"Ykcy":{"type":"plain_text_input","value":"100"}},"session_length":{"wNTo":{"type":"plain_text_input","value":"60"}}}}},"hash":"1594018450.CovdWvl7","title":{"type":"plain_text","text":"Add season","emoji":true},"clear_on_close":false,"notify_on_close":false,"close":{"type":"plain_text","text":"Cancel","emoji":true},"submit":{"type":"plain_text","text":"Submit","emoji":true},"previous_view_id":null,"root_view_id":"V0179GJD2TA","app_id":"A016CKNFP6F","external_id":"","app_installed_team_id":"T044B4VDU","bot_id":"B0172AHQ8QG"}',
  //     };

  //     // Mocking addSeason to return a season
  //     spyOn<any>(seasonsService, "add").and.returnValue(
  //       SeasonDto.from({
  //         id: "123",
  //         name: "test",
  //         startDate: new Date(),
  //         endDate: new Date(),
  //       }),
  //     );

  //     // Mocking addBoardConfig to return a season
  //     spyOn<any>(boardConfigService, "add").and.returnValue(
  //       BoardConfigDto.from({
  //         id: "test",
  //         seasonId: "321",
  //         inventorySize: 5,
  //         canTackle: false,
  //         teleporters: 1,
  //         teleportRelocation: 10,
  //         height: 15,
  //         width: 15,
  //         minimumDelayBetweenMoves: 100,
  //         sessionLength: 60,
  //       }),
  //     );

  //     await expect(slackService.handleInteract(payload)).resolves.toEqual(
  //       undefined,
  //     );
  //   });
});
