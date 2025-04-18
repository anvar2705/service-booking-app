import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
} from '@nestjs/common';

import { FindAllQueryDto } from 'common/utils';
import { ActiveUser, ActiveUserData } from 'models/iam/decorators';
import { Roles } from 'models/iam/decorators/roles.decorator';
import { RolesEnum } from 'models/role/constants';

import { AddServicesToEmployeeDto } from './dto/add-services-to-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER])
    @Post()
    create(@Body() dto: CreateEmployeeDto) {
        return this.employeeService.create(dto);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER])
    @Get(':id')
    findOne(@Param('id', new ParseIntPipe()) id: number) {
        return this.employeeService.findOne(id);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER, RolesEnum.EMPLOYEE])
    @Patch(':id')
    update(
        @ActiveUser() user: ActiveUserData,
        @Param('id', new ParseIntPipe()) id: number,
        @Body() dto: UpdateEmployeeDto,
    ) {
        return this.employeeService.update(user, id, dto);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER])
    @Delete(':id')
    remove(
        @ActiveUser() user: ActiveUserData,
        @Param('id', new ParseIntPipe()) id: number,
    ) {
        return this.employeeService.remove(user, id);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER, RolesEnum.EMPLOYEE])
    @Get(':id/services')
    findServices(
        @ActiveUser() user: ActiveUserData,
        @Param('id', new ParseIntPipe()) id: number,
        @Query() dto: FindAllQueryDto,
    ) {
        return this.employeeService.findEmployeeServices(user, id, dto);
    }

    @Roles([RolesEnum.ADMIN, RolesEnum.COMPANY_OWNER])
    @Post(':id/services')
    addServices(
        @ActiveUser() user: ActiveUserData,
        @Param('id', new ParseIntPipe()) id: number,
        @Body() dto: AddServicesToEmployeeDto,
    ) {
        return this.employeeService.addServicesToEmployee(
            user,
            id,
            dto.service_uuids,
        );
    }
}
