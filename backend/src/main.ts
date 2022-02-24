import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as compression from "compression";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./exception-filter";
import { EnvelopeInterceptor } from "./interceptors/envelope.interceptor";
import { CustomLogger } from "./logger";
import bodyParser = require("body-parser");
import * as apiMetrics from "prometheus-api-metrics";
import { isLocal } from "./hooks/environment";

async function bootstrap() {
  const logger = new CustomLogger();
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });
  app.use(bodyParser.json());
  app.use(compression());
  app.use(apiMetrics());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new EnvelopeInterceptor(logger));

  const schema = isLocal() ? "http" : "https";

  const options = new DocumentBuilder()
    .setTitle("Diamonds")
    .setDescription("Diamonds API description")
    .setVersion("2.0")
    .setSchemes(schema)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document);

  logger.log(`Starting application on ${process.env.PORT || 5000}`);
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
