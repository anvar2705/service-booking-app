import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Role } from '../types';

export interface ActiveUserData {
    sub: number;
    email: string;
    role?: Role;
}

export const REQUEST_USER_KEY = 'user';

export const ActiveUser = createParamDecorator(
    (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
        return field ? user?.[field] : user;
    },
);
