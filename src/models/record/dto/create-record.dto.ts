import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsUUID,
    Length,
} from 'class-validator';

export class CreateRecordDto {
    @IsOptional()
    client_name?: string;

    @IsOptional()
    client_phone?: string;

    @IsDateString()
    time_start: string;

    @IsNumber()
    duration: number;

    @IsOptional()
    @Length(0, 500)
    comment?: string;

    @IsUUID()
    service_uuid: string;
}
