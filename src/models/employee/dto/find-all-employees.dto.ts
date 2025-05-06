import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';

import { FindAllQueryDto, ToBoolean } from 'common/utils';

export enum FindAllEmployeesSortingEnum {
    NAME = 'name',
    USERNAME = 'username',
    EMAIL = 'email',
}

export enum FindAllEmployeesFiltersEnum {
    USERNAME = 'username',
    EMAIL = 'email',
}

class FindAllEmployeesSortingDto {
    @IsEnum(FindAllEmployeesSortingEnum)
    id: FindAllEmployeesSortingEnum;

    @ToBoolean()
    @IsBoolean()
    desc: boolean;
}

class FindAllEmployeesFilterDto {
    @IsEnum(FindAllEmployeesFiltersEnum)
    id: FindAllEmployeesFiltersEnum;

    @IsString()
    value: string;
}

export class FindAllEmployeesDto extends FindAllQueryDto {
    @IsOptional()
    @IsUUID()
    company_uuid?: string;

    @IsOptional()
    @ValidateNested()
    sorting?: FindAllEmployeesSortingDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FindAllEmployeesFilterDto)
    filters?: FindAllEmployeesFilterDto[];
}
