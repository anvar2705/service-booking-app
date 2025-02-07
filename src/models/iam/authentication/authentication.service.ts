import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UserService } from 'models/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';

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

        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email,
            },
            {
                secret: this.jwtConfiguration.secret,
                expiresIn: Number(this.jwtConfiguration.accessTokenTTL),
                // audience: this.jwtConfiguration.audience,
                // issuer: this.jwtConfiguration.issuer,
            },
        );

        return { accessToken };
    }
}
