import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from './modules/guard/JwtAuthGuard';
import { RolesGuard } from './modules/guard/RolesGuard';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //config Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
