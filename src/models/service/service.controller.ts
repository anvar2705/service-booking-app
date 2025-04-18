import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseUUIDPipe,
} from '@nestjs/common';

import { ActiveUser, ActiveUserData } from 'models/iam/decorators';
import { Roles } from 'models/iam/decorators/roles.decorator';
import { RolesEnum } from 'models/role/constants';

import { CreateServiceDto } from './dto/create-service.dto';
import { FindAllServicesDto } from './dto/find-all-services.dto';
import { RemoveServiceDto } from './dto/remove-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceService } from './service.service';

@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) {}

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER, RolesEnum.EMPLOYEE])
    @Post()
    create(@ActiveUser() user: ActiveUserData, @Body() dto: CreateServiceDto) {
        return this.serviceService.create(user, dto);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER, RolesEnum.EMPLOYEE])
    @Get()
    findAll(
        @ActiveUser() user: ActiveUserData,
        @Query() dto: FindAllServicesDto,
    ) {
        return this.serviceService.findAll(user, dto);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER, RolesEnum.EMPLOYEE])
    @Get(':uuid')
    findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.serviceService.findOne(uuid);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER, RolesEnum.EMPLOYEE])
    @Patch(':uuid')
    update(
        @ActiveUser() user: ActiveUserData,
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Body() dto: UpdateServiceDto,
    ) {
        return this.serviceService.update(user, uuid, dto);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER])
    @Delete(':uuid')
    remove(
        @ActiveUser() user: ActiveUserData,
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Body() dto: RemoveServiceDto,
    ) {
        return this.serviceService.remove(user, uuid, dto);
    }
}
