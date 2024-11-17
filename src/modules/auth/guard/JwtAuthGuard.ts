import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.verbose('Public route accessed');
      return true;
    }

    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      if (err) {
        this.logger.error(`Authentication error: ${err.message}`, err.stack);
      } else {
        this.logger.warn(
          'Unauthorized access attempt: Missing or invalid token',
        );
      }

      throw err || new UnauthorizedException('Invalid or missing token');
    }
    this.logger.log(`Authenticated user: ${user.username}`);
    return user;
  }
}
