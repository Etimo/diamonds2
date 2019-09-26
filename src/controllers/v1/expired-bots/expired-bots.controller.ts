import { Controller, Get } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";

@ApiUseTags("Expired bots")
@Controller("api/expiredbots")
export class ExpiredBotsController {
  @Get()
  getAll() {}
}
