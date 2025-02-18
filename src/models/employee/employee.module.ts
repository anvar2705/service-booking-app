import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEnum } from 'common';
import { ServiceModule } from 'models/service/service.module';

import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Employee], ConfigEnum.DB_CONNECTION_NAME),
        ServiceModule,
    ],
    controllers: [EmployeeController],
    providers: [EmployeeService],
})
export class EmployeeModule {}
