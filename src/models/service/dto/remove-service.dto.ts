import { PickType } from '@nestjs/mapped-types';

import { CreateServiceDto } from './create-service.dto';

export class RemoveServiceDto extends PickType(CreateServiceDto, [
    'company_uuid',
]) {}
