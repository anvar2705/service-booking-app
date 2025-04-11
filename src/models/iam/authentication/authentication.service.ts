import { randomUUID } from 'crypto';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Role } from 'models/role/types';
import { User } from 'models/user/entities/user.entity';
import { UserService } from 'models/user/user.service';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { jwtConfig } from '../config/jwt.config';
import { ActiveUserData } from '../decorators';
import { HashingService } from '../hashing/hashing.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signUp(dto: SignUpDto) {
        // const { company_name, ...employeeDto } = dto;
        // // const company = await this.companyService.create({
        // //     name: company_name,
        // // });
        // const companyOwnerRole = await this.roleService.findByName(
        //     RolesEnum.COMPANY_OWNER,
        // );
        // return await this.employeeService.create({
        //     ...employeeDto,
        //     company_uuid: 'company.uuid',
        //     role_ids: [companyOwnerRole.id],
        // });
    }

    async signIn(dto: SignInDto) {
        const { username, password } = dto;

        const user = await this.userService._findByUsername(username, true);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isEqual = await this.hashingService.compare(
            password,
            user.password,
        );
        if (!isEqual) {
            throw new UnauthorizedException('Wrong credentials');
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
            this.signToken<Pick<ActiveUserData, 'email' | 'roles'>>(
                user.id,
                Number(this.jwtConfiguration.accessTokenTTL),
                {
                    email: user.email,
                    roles: user.roles.map((r) => r.name as Role),
                },
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
