import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

import { ConfigEnum } from 'common';

export const dbConfiguration = registerAs(
    ConfigEnum.DB_CONFIG_KEY,
    (): DataSourceOptions => ({
        name: ConfigEnum.DB_CONNECTION_NAME,
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/db/migrations/*.js'],
        migrationsTableName: ConfigEnum.DB_MIGRATIONS_TABLE_NAME,
        migrationsRun: false,
        synchronize: true,
    }),
);
