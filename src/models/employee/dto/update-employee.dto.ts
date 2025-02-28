import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends OmitType(
    PartialType(CreateEmployeeDto),
    ['company_uuid'],
) {
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    service_uuids?: string[];
}
