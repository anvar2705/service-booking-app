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

import { CreateServiceDto } from './dto/create-service.dto';
import { FindAllServicesDto } from './dto/find-all-services.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceService } from './service.service';

@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) {}

    @Post()
    create(@Body() dto: CreateServiceDto) {
        return this.serviceService.create(dto);
    }

    @Get()
    findAll(@Query() dto: FindAllServicesDto) {
        return this.serviceService.findAll(dto);
    }

    @Get(':uuid')
    findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.serviceService.findOne(uuid);
    }

    @Patch(':uuid')
    update(
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Body() dto: UpdateServiceDto,
    ) {
        return this.serviceService.update(uuid, dto);
    }

    @Delete(':uuid')
    remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.serviceService.remove(uuid);
    }
}
