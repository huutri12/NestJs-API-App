import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from './modules/auth/guard/JwtAuthGuard';
import { RolesGuard } from './modules/auth/guard/RolesGuard';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector));

  // const reflectorRole = app.get(Reflector);
  // app.useGlobalGuards(new RolesGuard(reflectorRole));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
