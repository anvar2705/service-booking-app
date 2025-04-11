import { IsInt, IsOptional, IsPositive, IsUUID } from 'class-validator';

import { FindAllQueryDto } from 'common/utils';

export class FindAllServicesDto extends FindAllQueryDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    employee_id?: number;

    @IsOptional()
    @IsUUID()
    company_uuid?: string;
}
