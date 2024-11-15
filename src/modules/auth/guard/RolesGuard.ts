import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enums/role.enum';
import { ROLES_KEY } from 'src/modules/decorator/customize';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflectorRole: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflectorRole.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Nếu không yêu cầu vai trò cụ thể, cho phép truy cập
    }

    const { user } = context.switchToHttp().getRequest();
    return user && requiredRoles.some((role) => user.roles?.includes(role));
  }
}
