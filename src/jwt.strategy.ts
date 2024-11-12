import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRECTKEY,
    });
  }

  async validate({ email }) {
    const user = await this.authService.validateUser(email);
    if (!user) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
