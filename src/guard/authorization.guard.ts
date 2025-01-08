import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import {
  PERMISSION_KEY,
  Permissions,
} from 'src/decorators/permissions.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // CHECK: If user is not authenticated
    if (!request.userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const routePermissions: Permissions[] = this.reflector.getAllAndOverride(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const userPermissions = await this.authService.getUserPermissions(
      request.userId,
    );

    for (const routePermission of routePermissions) {
      // CHECK: If user has access to the resource
      const hasResource = userPermissions.filter(
        (perm) => perm.resource === routePermission.resource,
      );

      if (!hasResource.length) {
        throw new ForbiddenException('User not allowed to access');
      }

      // CHECK: If user has access to all actions
      const hasAllActions = routePermission.actions.every((action) => {
        return hasResource.some((perm) => perm.action === action);
      });

      if (!hasAllActions) {
        throw new ForbiddenException("User can't perform this action");
      }
    }

    return true;
  }
}
