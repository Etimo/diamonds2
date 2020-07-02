import { Injectable } from "@nestjs/common";
import { SeasonsService } from "./seasons.service";
import { createSeasonsBody } from "../utils/slack.utils";
import axios from "axios";

@Injectable()
export class SlackService {
  constructor(private seasonsService: SeasonsService) {}

  public async getAllSeasons(input) {
    console.log(input);
    const seasons = await this.seasonsService.all();
    const view = createSeasonsBody(input.trigger_id, seasons);
    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env["SLACK_ACCESS_TOKEN"]}`,
    };
    axios
      .post("https://slack.com/api/views.open", view, { headers: headers })
      .then(response => {
        const data = response.data;
        if (!data.ok) {
          return data.error;
        }
      })
      .catch(error => {
        console.log("-Error: ", error);
      });
    return;
  }
}
