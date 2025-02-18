import { IsArray, IsOptional, IsUUID, Length } from 'class-validator';

export class CreateEmployeeDto {
    @Length(2, 30)
    name: string;

    @IsOptional()
    surname?: string;

    @IsOptional()
    patronymic?: string;

    @IsOptional()
    photoUrl?: string;

    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    serviceUUIDs?: string[];
}
