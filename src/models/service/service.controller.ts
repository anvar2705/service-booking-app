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
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceService } from './service.service';

@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) {}

    @Post()
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.serviceService.create(createServiceDto);
    }

    @Get()
    findAll(@Query() dto: FindAllQueryDto) {
        return this.serviceService.findAll(dto);
    }

    @Get(':uuid')
    findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.serviceService.findOne(uuid);
    }

    @Patch(':uuid')
    update(
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Body() updateServiceDto: UpdateServiceDto,
    ) {
        return this.serviceService.update(uuid, updateServiceDto);
    }

    @Delete(':uuid')
    remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.serviceService.remove(uuid);
    }
}
