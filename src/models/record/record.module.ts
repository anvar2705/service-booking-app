import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEnum } from 'common';
import { ServiceModule } from 'models/service/service.module';

import { Record } from './entities/record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Record], ConfigEnum.DB_CONNECTION_NAME),
        ServiceModule,
    ],
    controllers: [RecordController],
    providers: [RecordService],
})
export class RecordModule {}
