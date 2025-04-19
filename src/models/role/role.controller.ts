import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';

import { Roles } from 'models/iam/decorators/roles.decorator';

import { RolesEnum } from './constants';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Roles([RolesEnum.ADMIN])
@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    findAll() {
        return this.roleService.findAll();
    }

    @Get(':id')
    findById(@Param('id', new ParseIntPipe()) id: number) {
        return this.roleService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        return this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    remove(@Param('id', new ParseIntPipe()) id: number) {
        return this.roleService.delete(id);
    }
}
