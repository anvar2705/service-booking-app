import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Post,
    ParseIntPipe,
} from '@nestjs/common';

import { Roles } from 'models/iam/decorators/roles.decorator';
import { RolesEnum } from 'models/role/constants';

import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Roles([RolesEnum.ADMIN])
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll(@Query() dto: FindAllUsersDto) {
        return this.userService.findAll(dto);
    }

    @Get(':id')
    findById(@Param('id', new ParseIntPipe()) id: number) {
        return this.userService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id', new ParseIntPipe()) id: number) {
        return this.userService.delete(id);
    }
}
