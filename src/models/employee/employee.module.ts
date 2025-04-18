import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEnum } from 'common';
import { Company } from 'models/company/entities/company.entity';
import { ServiceModule } from 'models/service/service.module';
import { UserModule } from 'models/user/user.module';

import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [Employee, Company],
            ConfigEnum.DB_CONNECTION_NAME,
        ),
        forwardRef(() => ServiceModule),
        UserModule,
    ],
    controllers: [EmployeeController],
    providers: [EmployeeService],
    exports: [EmployeeService],
})
export class EmployeeModule {}
