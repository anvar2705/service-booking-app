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
import { ActiveUser, ActiveUserData } from 'models/iam/decorators';
import { Roles } from 'models/iam/decorators/roles.decorator';
import { RolesEnum } from 'models/role/constants';

import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindAllCompaniesDto } from './dto/find-all-companies.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Roles([RolesEnum.ADMIN])
    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @Roles([RolesEnum.ADMIN])
    @Get()
    findAll(@Query() dto: FindAllCompaniesDto) {
        return this.companyService.findAll(dto);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER, RolesEnum.EMPLOYEE])
    @Get(':uuid')
    findOne(
        @ActiveUser() user: ActiveUserData,
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
    ) {
        return this.companyService.findOne(user, uuid);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER])
    @Patch(':uuid')
    update(
        @ActiveUser() user: ActiveUserData,
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        return this.companyService.update(user, uuid, updateCompanyDto);
    }

    @Roles([RolesEnum.ADMIN])
    @Delete(':uuid')
    remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return this.companyService.remove(uuid);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER])
    @Get(':uuid/employees')
    findEmployees(
        @ActiveUser() user: ActiveUserData,
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Query() dto: FindAllQueryDto,
    ) {
        return this.companyService.findCompanyEmployees(user, uuid, dto);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER])
    @Get(':uuid/services')
    findServices(
        @ActiveUser() user: ActiveUserData,
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Query() dto: FindAllQueryDto,
    ) {
        return this.companyService.findCompanyServices(user, uuid, dto);
    }
}
