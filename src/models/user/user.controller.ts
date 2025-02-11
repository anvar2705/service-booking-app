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
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Roles([RolesEnum.ADMIN])
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll(@Query() query: FindAllQueryDto) {
        return this.userService.findAll(query);
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
