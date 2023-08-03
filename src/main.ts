import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //to use pipes valisation
  app.useGlobalPipes(new ValidationPipe({
    // accept only the values in dto
    whitelist: true
  }));
  await app.listen(3000);
}
bootstrap();
