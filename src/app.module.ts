import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from 'common/helpers/env.helper';
import { ConfigEnum } from 'common';
import { dbConfiguration } from 'db/data-source.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'models/user';
import { IamModule } from 'models/iam';

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
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
