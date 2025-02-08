import { registerAs } from '@nestjs/config';
import { ConfigEnum } from 'common';

export const redisConfig = registerAs(ConfigEnum.REDIS_CONFIG_KEY, () => ({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
}));
