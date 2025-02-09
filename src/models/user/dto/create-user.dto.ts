import { IsEmail, Length, IsOptional } from 'class-validator';
import { Role } from 'models/iam/types';

export class CreateUserDto {
    @IsEmail()
    @Length(3, 60)
    email: string;

    @Length(6, 20)
    password: string;

    @IsOptional()
    role?: Role;
}
