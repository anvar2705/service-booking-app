import { IsEnum, IsNumber, IsOptional, Length } from 'class-validator';

import { ServiceTypeEnum } from '../constants';

export class CreateServiceDto {
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
