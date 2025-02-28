import {
    IsArray,
    IsEmail,
    IsNumber,
    IsOptional,
    IsUUID,
    Length,
} from 'class-validator';

export class CreateEmployeeDto {
    @IsUUID()
    company_uuid: string;

    @Length(3, 30)
    username: string;

    @Length(5, 20)
    password: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @Length(3, 30)
    name?: string;

    @IsOptional()
    @Length(3, 30)
    surname?: string;

    @IsOptional()
    @Length(3, 30)
    patronymic?: string;

    @IsOptional()
    photo_url?: string;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    role_ids?: number[];
}
