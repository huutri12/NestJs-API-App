import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './modules/auth/service/auth.service';
import { Injectable } from '@nestjs/common';
import { Role } from './enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRETKEY,
    });
  }

  async validate(payload: { sub: number; email: string; roles: Role }) {
    // Tìm người dùng từ payload của JWT
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
