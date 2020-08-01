import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from "config";

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle("Task Management API")
    .setDescription("Task Management Practice API")
    .addBearerAuth()
    .setVersion("1.0")
    .addTag("Task")
    .addTag("Auth")
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("api-list", app, document)

  if (process.env.NODE_ENV === "development") {
    app.enableCors();
  }
  const port = process.env.PORT || serverConfig.port
  await app.listen(port);
  logger.log(`Application is listening to ${port}`)

}
bootstrap();
