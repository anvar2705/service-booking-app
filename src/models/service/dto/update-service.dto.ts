import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';

import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends OmitType(PartialType(CreateServiceDto), [
    'company_uuid',
]) {
    @IsUUID()
    company_uuid: string;
}
