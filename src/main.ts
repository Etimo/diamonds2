import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import bodyParser = require("body-parser");
import { ValidationExceptionFilter } from "./validation-exception.filter";

import { CustomLogger } from "./logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  app.use(bodyParser.json());
  app.useGlobalFilters(new ValidationExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle("Diamonds")
    .setDescription("Diamonds API description")
    .setVersion("2.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document);

  await app.listen(3000);
}
bootstrap();
