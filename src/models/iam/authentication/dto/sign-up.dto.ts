import { IsEmail, Length } from 'class-validator';

export class SignUpDto {
    @IsEmail()
    @Length(3, 60)
    email: string;

    @Length(5, 20)
    password: string;
}
