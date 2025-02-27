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

import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindAllCompaniesDto } from './dto/find-all-companies.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @Get()
    findAll(@Query() dto: FindAllCompaniesDto) {
        return this.companyService.findAll(dto);
    }

    @Get(':uuid')
    findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.companyService.findOne(uuid);
    }

    @Patch(':uuid')
    update(
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        return this.companyService.update(uuid, updateCompanyDto);
    }

    @Delete(':uuid')
    remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.companyService.remove(uuid);
    }
}
