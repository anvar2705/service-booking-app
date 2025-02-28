import {
    IsEmail,
    Length,
    IsOptional,
    IsArray,
    IsNumber,
} from 'class-validator';

export class CreateUserDto {
    @Length(3, 30)
    username: string;

    @IsEmail()
    email?: string;

    @Length(5, 20)
    password: string;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    role_ids?: number[];
}
