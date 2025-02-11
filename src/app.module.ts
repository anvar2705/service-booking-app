import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEnum } from 'common';
import { getEnvPath } from 'common/helpers/env.helper';
import { dbConfiguration } from 'db/data-source.config';
import { IamModule } from 'models/iam/iam.module';
import { RoleModule } from 'models/role/role.module';
import { UserModule } from 'models/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: getEnvPath(`${__dirname}/common/envs`),
            isGlobal: true,
            load: [dbConfiguration],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            name: ConfigEnum.DB_CONNECTION_NAME,
            useFactory: async (configService: ConfigService) =>
                configService.get(ConfigEnum.DB_CONFIG_KEY),
        }),
        UserModule,
        IamModule,
        RoleModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
