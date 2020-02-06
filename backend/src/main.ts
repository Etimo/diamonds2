import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import bodyParser = require("body-parser");

import { CustomLogger } from "./logger";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./exception-filter";
import { TimingInterceptor } from "./interceptors/timing.interceptor";
import { EnvelopeInterceptor } from "./interceptors/envelope.interceptor";
import * as compression from "compression";

async function bootstrap() {
  const logger = new CustomLogger();
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });
  app.use(bodyParser.json());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TimingInterceptor(logger));
  app.useGlobalInterceptors(new EnvelopeInterceptor(logger));

  const options = new DocumentBuilder()
    .setTitle("Diamonds")
    .setDescription("Diamonds API description")
    .setVersion("2.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
