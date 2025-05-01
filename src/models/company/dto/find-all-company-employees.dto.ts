import { OmitType } from '@nestjs/mapped-types';

import { FindAllEmployeesDto } from 'models/employee/dto/find-all-employees.dto';

export class FindAllCompanyEmployeesDto extends OmitType(FindAllEmployeesDto, [
    'company_uuid',
]) {}
