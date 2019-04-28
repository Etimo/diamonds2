import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import bodyParser = require("body-parser");
import { ValidationExceptionFilter } from "./validation-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json());
  app.useGlobalFilters(new ValidationExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle("Diamonds")
    .setDescription("Diamonds API description")
    .setVersion("1.0")
    .addTag("diamonds")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document);

  await app.listen(3000);
}
bootstrap();
