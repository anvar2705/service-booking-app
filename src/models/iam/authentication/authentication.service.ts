import { randomUUID } from 'crypto';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CompanyService } from 'models/company/company.service';
import { EmployeeService } from 'models/employee/employee.service';
import { RolesEnum } from 'models/role/constants';
import { RoleService } from 'models/role/role.service';
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
        private readonly companyService: CompanyService,
        private readonly roleService: RoleService,
        private readonly employeeService: EmployeeService,
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signUp(dto: SignUpDto) {
        const { company_name, ...employeeDto } = dto;

        const company = await this.companyService.create({
            name: company_name,
        });

        const companyOwnerRole = await this.roleService.findByName(
            RolesEnum.COMPANY_OWNER,
        );

        await this.employeeService.create({
            ...employeeDto,
            company_uuid: company.uuid,
            role_ids: [companyOwnerRole.id],
        });

        return undefined;
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

        const employee = await this.employeeService.findOneByUserId(
            user.id,
            true,
        );

        return this.generateTokens({ ...user, employee_id: employee?.id });
    }

    async resreshTokens(dto: RefreshTokenDto) {
        try {
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
            >(dto.refresh_token, {
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

            const employee = await this.employeeService.findOneByUserId(
                user.id,
                true,
            );

            return this.generateTokens({ ...user, employee_id: employee.id });
        } catch (error) {
            if (error instanceof InvalidatedRefreshTokenError) {
                throw new UnauthorizedException('Access denied');
            }

            throw new UnauthorizedException();
        }
    }

    async generateTokens(user: User & { employee_id?: number }) {
        const refreshTokenId = randomUUID();

        const [access_token, refresh_token] = await Promise.all([
            this.signToken<Omit<ActiveUserData, 'sub'>>(
                user.id,
                Number(this.jwtConfiguration.accessTokenTTL),
                {
                    email: user.email,
                    roles: user.roles.map((r) => r.name as Role),
                    employee_id: user.employee_id,
                },
            ),
            this.signToken(
                user.id,
                Number(this.jwtConfiguration.refreshTokenTTL),
                { refreshTokenId },
            ),
        ]);

        await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

        return { access_token, refresh_token };
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

    async getAccountInfo(dto: ActiveUserData) {
        const { employee_id } = dto;

        return this.employeeService.findOne(employee_id);
    }
}
