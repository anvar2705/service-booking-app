import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsUUID,
    Length,
} from 'class-validator';

export class CreateRecordDto {
    @IsOptional()
    clientName?: string;

    @IsOptional()
    clientPhone?: string;

    @IsDateString()
    timeStart: string;

    @IsNumber()
    duration: number;

    @IsOptional()
    @Length(0, 500)
    comment?: string;

    @IsUUID()
    serviceUUID: string;
}
