import { forwardRef, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { UserModule } from 'models/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { redisConfig } from './config/redis.config';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
        ConfigModule.forRoot({
            load: [redisConfig],
        }),
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
