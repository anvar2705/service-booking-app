import { IsEnum, IsNumber, IsOptional, Length } from 'class-validator';

import { ServiceTypeEnum } from '../constants';

export class CreateServiceDto {
    @Length(3, 120)
    name: string;

    @IsNumber()
    priceFrom: number;

    @IsNumber()
    @IsOptional()
    priceTo: number;

    @IsNumber()
    duration: number;

    @IsOptional()
    @IsEnum(ServiceTypeEnum)
    type: string;
}
