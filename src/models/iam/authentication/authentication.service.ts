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

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {}

    async signUp(dto: SignUpDto) {
        const hashedPassword = await this.hashingService.hash(dto.password);
        return this.userService._create({ ...dto, password: hashedPassword });
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
            const { sub } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, 'sub'>
            >(dto.refreshToken, {
                secret: this.jwtConfiguration.secret,
            });

            const user = await this.userService.findById(sub);

            return this.generateTokens(user);
        } catch {
            throw new UnauthorizedException();
        }
    }

    async generateTokens(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken<Pick<ActiveUserData, 'email'>>(
                user.id,
                Number(this.jwtConfiguration.accessTokenTTL),
                { email: user.email },
            ),
            this.signToken<void>(
                user.id,
                Number(this.jwtConfiguration.refreshTokenTTL),
            ),
        ]);

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
