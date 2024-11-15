import { PrismaClient } from "#prisma/client";
import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import process from "node:process";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on("beforeExit", () => {
      app.close();
    });
  }
}
