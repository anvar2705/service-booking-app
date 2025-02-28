import { Length } from 'class-validator';

export class SignInDto {
    @Length(3, 30)
    username: string;

    @Length(5, 20)
    password: string;
}
