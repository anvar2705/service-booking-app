import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEnum } from 'common';

import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role], ConfigEnum.DB_CONNECTION_NAME)],
    providers: [RoleService],
    controllers: [RoleController],
    exports: [RoleService],
})
export class RoleModule {}
