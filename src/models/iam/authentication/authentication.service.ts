import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UserService } from 'models/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from 'models/user/entities/user.entity';
import { ActiveUserData } from '../decorators';
import { randomUUID } from 'crypto';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    ) {}

    async signUp(dto: SignUpDto) {
        return this.userService.create(dto);
    }

    async signIn(dto: SignInDto) {
        const { email, password } = dto;

        const user = await this.userService._findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Пользователь не существует');
        }

        const isEqual = await this.hashingService.compare(
            password,
            user.password,
        );
        if (!isEqual) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        return this.generateTokens(user);
    }

    async resreshTokens(dto: RefreshTokenDto) {
        try {
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
            >(dto.refreshToken, {
                secret: this.jwtConfiguration.secret,
            });

            const user = await this.userService.findById(sub);
            const isValid = await this.refreshTokenIdsStorage.validate(
                user.id,
                refreshTokenId,
            );

            if (isValid) {
                await this.refreshTokenIdsStorage.invalidate(user.id);
            } else {
                throw new InvalidatedRefreshTokenError();
            }

            return this.generateTokens(user);
        } catch (error) {
            if (error instanceof InvalidatedRefreshTokenError) {
                throw new UnauthorizedException('Access denied');
            }

            throw new UnauthorizedException();
        }
    }

    async generateTokens(user: User) {
        const refreshTokenId = randomUUID();

        const [accessToken, refreshToken] = await Promise.all([
            this.signToken<Pick<ActiveUserData, 'email' | 'role'>>(
                user.id,
                Number(this.jwtConfiguration.accessTokenTTL),
                { email: user.email, role: user.role },
            ),
            this.signToken(
                user.id,
                Number(this.jwtConfiguration.refreshTokenTTL),
                { refreshTokenId },
            ),
        ]);

        await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

        return { accessToken, refreshToken };
    }

    private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                secret: this.jwtConfiguration.secret,
                expiresIn,
                // audience: this.jwtConfiguration.audience,
                // issuer: this.jwtConfiguration.issuer,
            },
        );
    }
}
