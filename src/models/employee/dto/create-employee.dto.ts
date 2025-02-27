import { IsEmail, IsOptional, IsUUID, Length } from 'class-validator';

export class CreateEmployeeDto {
    @IsUUID()
    company_uuid: string;

    @Length(2, 30)
    username: string;

    @Length(5, 20)
    password: string;

    @IsOptional()
    @IsEmail()
    @Length(3, 60)
    email?: string;

    @Length(2, 30)
    name: string;

    @IsOptional()
    @Length(2, 30)
    surname?: string;

    @IsOptional()
    @Length(2, 30)
    patronymic?: string;

    @IsOptional()
    photo_url?: string;
}
