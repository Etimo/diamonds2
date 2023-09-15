import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import { Request } from "express";
import * as qs from "qs";
import { UnauthorizedError } from "../errors";

@Injectable()
export class AuthorizationService {
  async isSlackRequest(request: Request): Promise<void> {
    // Validating that the request was send from slack.
    const slackSigningSecret = process.env["SLACK_SIGNING_SECRET"] ?? "";
    const slackSignature = request.headers["x-slack-signature"] ?? "";
    const requestBody = qs.stringify(request.body, { format: "RFC1738" });
    const timestamp = request.headers["x-slack-request-timestamp"] ?? 0;

    if (!timestamp || !slackSignature) {
      this.throwUnauthorized();
    }
    const time = Math.floor(new Date().getTime() / 1000);

    // Ignore request if its older than 5 min.
    if (Math.abs(time - parseInt(timestamp.toString())) > 300) {
      this.throwUnauthorized();
    }

    // Create my signature with request data and slackSigningSecret
    const sigBasestring = "v0:" + timestamp + ":" + requestBody;
    const mySignature =
      "v0=" +
      crypto
        .createHmac("sha256", slackSigningSecret)
        .update(sigBasestring, "utf8")
        .digest("hex");

    // Compare my signature with x-slack-signature
    if (
      !crypto.timingSafeEqual(
        Buffer.from(mySignature, "utf8"),
        Buffer.from(slackSignature.toString(), "utf8"),
      )
    ) {
      this.throwUnauthorized();
    }
  }

  private throwUnauthorized() {
    throw new UnauthorizedError("You are not allowed to call this endpoint");
  }
}
