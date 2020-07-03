import { Injectable } from "@nestjs/common";
import { SeasonsService } from "./seasons.service";
import {
  createSeasonsBody,
  createAddSeasonBody,
  showModal,
  returnError,
} from "../utils/slack.utils";

@Injectable()
export class SlackService {
  constructor(private seasonsService: SeasonsService) {}

  public async getAllSeasons(input) {
    const seasons = await this.seasonsService.all();
    const view = createSeasonsBody(input.trigger_id, seasons);
    return await showModal(view);
  }

  public async getSeasonModal(input) {
    console.log("GET SEASON MODAL");
    console.log(input);
    const view = createAddSeasonBody(input.trigger_id);
    return await showModal(view);
  }

  public async handleInteract(input) {
    console.log("CALLBACK ID");
    const payload = JSON.parse(input.payload);
    console.log("parsed payload");
    console.log(payload);
    console.log(payload.view.callback_id);

    if (payload.view.callback_id === "add-season") {
      return await this.addSeason(payload);
    }
    return returnError("Could not process input");
  }

  private async addSeason(payload) {
    console.log("ADDING SEASON");
    const startDate = this.parseValues(payload, "start_date", "selected_date");
    const endDate = this.parseValues(payload, "end_date", "selected_date");
    const name = this.parseValues(payload, "season_name", "value");
    console.log(startDate);
    console.log(endDate);
    console.log(name);
    return;
  }

  private parseValues(payload, obj, value) {
    const object = payload.state.values[obj],
      key = Object.keys(object)[0];
    return object[key][value];
  }
}
