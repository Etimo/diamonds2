import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./exception-filter";
import { isLocal } from "./hooks/environment";
import bodyParser = require("body-parser");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json());
  // app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new EnvelopeInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const schema = isLocal() ? "http" : "https";

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
