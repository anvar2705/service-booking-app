import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @Length(3, 60)
    email: string;

    password: string;
}
