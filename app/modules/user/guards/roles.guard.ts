import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: any = await this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return false;
    }

    const req: Request = context.switchToHttp().getRequest();
    const role: string | undefined = req['user']?.role;

    if (!role) {
      return false;
    }

    return this.validateRoles(role, roles);
  }

  validateRoles(role: string, userRoles: string[]): boolean {
    return userRoles.includes(role);
  }
}
