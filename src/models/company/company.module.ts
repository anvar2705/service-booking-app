import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEnum } from 'common';
import { EmployeeModule } from 'models/employee/employee.module';
import { ServiceModule } from 'models/service/service.module';

import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Company], ConfigEnum.DB_CONNECTION_NAME),
        ServiceModule,
        EmployeeModule,
    ],
    controllers: [CompanyController],
    providers: [CompanyService],
    exports: [CompanyService],
})
export class CompanyModule {}
