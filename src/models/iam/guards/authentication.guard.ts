import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { IS_PUBLIC_KEY, REQUEST_USER_KEY } from '../constants';
import { Reflector } from '@nestjs/core';
import { ActiveUserData } from '../decorators';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload: ActiveUserData = await this.jwtService.verifyAsync(
                token,
                this.jwtConfiguration,
            );

            request[REQUEST_USER_KEY] = payload;
        } catch (e) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [, token] = request.headers?.authorization?.split(' ') ?? [];

        return token;
    }
}
