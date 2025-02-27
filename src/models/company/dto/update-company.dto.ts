import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    serviceUUIDs?: string[];

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    employeeIDs?: number[];
}
