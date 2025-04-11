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

import { AddServicesToEmployeeDto } from './dto/add-services-to-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { FindAllEmployeesDto } from './dto/find-all-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post()
    create(@Body() dto: CreateEmployeeDto) {
        return this.employeeService.create(dto);
    }

    @Get()
    findAll(@Query() dto: FindAllEmployeesDto) {
        return this.employeeService.findAll(dto);
    }

    @Get(':id')
    findOne(@Param('id', new ParseIntPipe()) id: number) {
        return this.employeeService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() dto: UpdateEmployeeDto,
    ) {
        return this.employeeService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', new ParseIntPipe()) id: number) {
        return this.employeeService.remove(id);
    }

    @Get(':id/services')
    findServices(
        @Param('id', new ParseIntPipe()) id: number,
        @Query() dto: FindAllQueryDto,
    ) {
        return this.employeeService.findEmployeeServices(id, dto);
    }

    @Post(':id/services')
    addServices(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() dto: AddServicesToEmployeeDto,
    ) {
        return this.employeeService.addServicesToEmployee(
            id,
            dto.service_uuids,
        );
    }
}
