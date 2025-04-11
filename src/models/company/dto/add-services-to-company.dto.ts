import { ArrayNotEmpty, IsUUID } from 'class-validator';

export class AddServicesToCompanyDto {
    @ArrayNotEmpty()
    @IsUUID('all', { each: true })
    service_uuids: string[];
}
