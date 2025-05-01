import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsUUID,
    ValidateNested,
} from 'class-validator';

import { FindAllQueryDto, ToBoolean } from 'common/utils';

export enum FindAllEmployeesSortingEnum {
    NAME = 'name',
    USERNAME = 'username',
}

class FindAllEmployeesSortingDto {
    @IsEnum(FindAllEmployeesSortingEnum)
    id: FindAllEmployeesSortingEnum;

    @ToBoolean()
    @IsBoolean()
    desc: boolean;
}

export class FindAllEmployeesDto extends FindAllQueryDto {
    @IsOptional()
    @IsUUID()
    company_uuid?: string;

    @IsOptional()
    @ValidateNested()
    sorting?: FindAllEmployeesSortingDto;
}
