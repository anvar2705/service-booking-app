import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { ActiveUserData } from '../decorators';
import { REQUEST_USER_KEY } from '../decorators/active-user.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: ActiveUserData = request[REQUEST_USER_KEY];

        return roles?.includes(user.role);
    }
}
