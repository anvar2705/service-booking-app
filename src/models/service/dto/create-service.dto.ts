import { IsEnum, IsNumber, IsOptional, IsUUID, Length } from 'class-validator';

import { ServiceTypeEnum } from '../constants';

export class CreateServiceDto {
    @IsUUID()
    company_uuid: string;

    @Length(3, 120)
    name: string;

    @IsNumber()
    price_from: number;

    @IsNumber()
    @IsOptional()
    price_to: number;

    @IsNumber()
    duration: number;

    @IsOptional()
    @IsEnum(ServiceTypeEnum)
    type: string;
}
