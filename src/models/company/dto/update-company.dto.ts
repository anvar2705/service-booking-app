import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    service_uuids?: string[];

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    employee_ids?: number[];
}
