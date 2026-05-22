import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //padrão criacional Factory que NestJS fornece 
  await app.listen(3000);
}
bootstrap();