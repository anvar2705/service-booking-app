import { IsOptional, IsUUID } from 'class-validator';

import { FindAllQueryDto } from 'common/utils';

export class FindAllEmployeesDto extends FindAllQueryDto {
    @IsOptional()
    @IsUUID()
    company_uuid?: string;
}
