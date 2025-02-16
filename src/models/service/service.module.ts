import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEnum } from 'common';

import { Service } from './entities/service.entity';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Service], ConfigEnum.DB_CONNECTION_NAME),
    ],
    controllers: [ServiceController],
    providers: [ServiceService],
    exports: [ServiceService],
})
export class ServiceModule {}
