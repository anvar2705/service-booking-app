import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { CompanyModule } from 'models/company/company.module';
import { EmployeeModule } from 'models/employee/employee.module';
import { RoleModule } from 'models/role/role.module';
import { UserModule } from 'models/user/user.module';

import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { jwtConfig } from './config/jwt.config';
import { redisConfig } from './config/redis.config';
import { AuthenticationGuard } from './guards/authentication.guard';
import { RolesGuard } from './guards/roles.guard';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
        ConfigModule.forRoot({
            load: [redisConfig],
        }),
        forwardRef(() => CompanyModule),
        forwardRef(() => RoleModule),
        forwardRef(() => EmployeeModule),
    ],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        AuthenticationService,
        RefreshTokenIdsStorage,
    ],
    controllers: [AuthenticationController],
    exports: [HashingService],
})
export class IamModule {}
