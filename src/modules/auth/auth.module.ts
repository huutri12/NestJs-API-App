// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt.strategy';
import { UserModule } from '../users/user.module';
import { RolesGuard } from '../guard/RolesGuard';
import { JwtAuthGuard } from '../guard/JwtAuthGuard';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRETKEY || 'defaultSecretKey',
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, JwtAuthGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
