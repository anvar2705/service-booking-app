import { IsOptional, IsString } from 'class-validator';

import { FindAllQueryDto } from 'common/utils';

export class FindAllCompaniesDto extends FindAllQueryDto {
    @IsOptional()
    @IsString()
    name: string;
}
