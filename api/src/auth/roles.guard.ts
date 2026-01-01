import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true; // No roles required, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }

        // Debug logging
        console.log('[RolesGuard] Required roles:', requiredRoles);
        console.log('[RolesGuard] User:', user);
        console.log('[RolesGuard] User role:', user.role);

        // Check if user has required role
        const hasRole = requiredRoles.includes(user.role);

        if (!hasRole && user.role === 'DEMO') {
            // Throw specific error for demo users
            throw new ForbiddenException({
                statusCode: 403,
                message: 'Demo users do not have permission to perform this action',
                error: 'DEMO_USER_FORBIDDEN',
            });
        }

        return hasRole;
    }
}
