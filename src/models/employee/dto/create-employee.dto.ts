import { IsEmail, IsOptional, Length } from 'class-validator';

export class CreateEmployeeDto {
    @Length(2, 30)
    username: string;

    @Length(5, 20)
    password: string;

    @IsEmail()
    @Length(3, 60)
    email?: string;

    @Length(2, 30)
    name: string;

    @IsOptional()
    surname?: string;

    @IsOptional()
    patronymic?: string;

    @IsOptional()
    photo_url?: string;
}
