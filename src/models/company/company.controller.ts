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

import { FindAllQueryDto } from 'common/utils';

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

    @Get(':uuid/employees')
    findEmployees(
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Query() dto: FindAllQueryDto,
    ) {
        return this.companyService.findCompanyEmployees(uuid, dto);
    }

    @Get(':uuid/services')
    findServices(
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Query() dto: FindAllQueryDto,
    ) {
        return this.companyService.findCompanyServices(uuid, dto);
    }
}
