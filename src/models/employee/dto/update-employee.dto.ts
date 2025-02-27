import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    roleIds: number[];

    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    serviceUUIDs?: string[];
}
