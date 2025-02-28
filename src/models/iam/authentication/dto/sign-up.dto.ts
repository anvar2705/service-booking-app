import { IsEmail, Length } from 'class-validator';

export class SignUpDto {
    @Length(3, 30)
    username: string;

    @IsEmail()
    email: string;

    @Length(5, 20)
    password: string;

    @Length(3, 60)
    company_name: string;
}
