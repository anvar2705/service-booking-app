import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends OmitType(
    PartialType(CreateEmployeeDto),
    ['company_uuid'],
) {
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    role_ids: number[];

    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    service_uuids?: string[];
}
