import {
    IsEmail,
    Length,
    IsOptional,
    IsNumber,
    ArrayNotEmpty,
} from 'class-validator';

export class CreateUserDto {
    @Length(3, 30)
    username: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @Length(5, 20)
    password: string;

    @IsOptional()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    role_ids?: number[];
}
