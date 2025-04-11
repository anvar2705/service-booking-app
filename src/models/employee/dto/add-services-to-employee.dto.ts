import { ArrayNotEmpty, IsUUID } from 'class-validator';

export class AddServicesToEmployeeDto {
    @ArrayNotEmpty()
    @IsUUID('all', { each: true })
    service_uuids: string[];
}
