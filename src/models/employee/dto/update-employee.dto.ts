import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends OmitType(
    PartialType(CreateEmployeeDto),
    ['company_uuid'],
) {}
