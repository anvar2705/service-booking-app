import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UserService } from 'models/user';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly hashingService: HashingService,
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

        return true;
    }
}
