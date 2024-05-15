import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { port } from './utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  app.enableCors();
}
bootstrap();
