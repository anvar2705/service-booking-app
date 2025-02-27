import {
    IsEmail,
    Length,
    IsOptional,
    IsArray,
    IsNumber,
} from 'class-validator';

export class CreateUserDto {
    @Length(2, 30)
    username: string;

    @IsEmail()
    @Length(3, 60)
    email?: string;

    @Length(5, 20)
    password: string;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    roleIds?: number[];
}
