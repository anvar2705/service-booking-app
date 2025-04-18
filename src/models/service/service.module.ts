import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEnum } from 'common';
import { Company } from 'models/company/entities/company.entity';
import { EmployeeModule } from 'models/employee/employee.module';

import { Service } from './entities/service.entity';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [Service, Company],
            ConfigEnum.DB_CONNECTION_NAME,
        ),
        forwardRef(() => EmployeeModule),
    ],
    controllers: [ServiceController],
    providers: [ServiceService],
    exports: [ServiceService],
})
export class ServiceModule {}
