import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../types/jwt-payload.type';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from 'database/generated/prisma/enums';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (user.role === Role.SUPER_ADMIN) {
      return true;
    }

    return requiredRoles.includes(user.role);
  }
}
