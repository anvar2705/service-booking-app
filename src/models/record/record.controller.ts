import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';

import { CreateRecordDto } from './dto/create-record.dto';
import { FindAllRecordsDto } from './dto/find-all-records.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordService } from './record.service';

@Controller('records')
export class RecordController {
    constructor(private readonly recordService: RecordService) {}

    @Post()
    create(@Body() dto: CreateRecordDto) {
        return this.recordService.create(dto);
    }

    @Get()
    findAll(@Query() dto: FindAllRecordsDto) {
        return this.recordService.findAll(dto);
    }

    @Get(':uuid')
    findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.recordService.findOne(uuid);
    }

    @Patch(':uuid')
    update(
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Body() dto: UpdateRecordDto,
    ) {
        return this.recordService.update(uuid, dto);
    }

    @Delete(':uuid')
    remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.recordService.remove(uuid);
    }
}
