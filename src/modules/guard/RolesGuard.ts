import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorator/customize';
import { Role } from 'src/enums/role.enum';
import { UserService } from 'src/modules/users/service/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      this.logger.warn('Access denied: No user found in request');
      throw new ForbiddenException('Access denied: User not authenticated');
    }
  
    const userR = await this.userService.findByEmail(user.email);
    console.log(userR);
    // const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    const hasRole = requiredRoles.includes(userR.role);
 
    if (!hasRole) {
      this.logger.warn(
        `Access denied for user ${user.username} (roles: ${user.roles})`,
      );
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    this.logger.log(`Access granted for user ${user.username}`);
    return true;
  }
}
