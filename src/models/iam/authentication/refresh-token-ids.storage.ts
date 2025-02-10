import {
    Inject,
    Injectable,
    OnApplicationBootstrap,
    OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';

import { redisConfig } from '../config/redis.config';

@Injectable()
export class RefreshTokenIdsStorage
    implements OnApplicationBootstrap, OnApplicationShutdown
{
    constructor(
        @Inject(redisConfig.KEY)
        private readonly redisConfiguration: ConfigType<typeof redisConfig>,
    ) {}

    private redisClient: Redis;

    onApplicationBootstrap() {
        this.redisClient = new Redis({
            host: this.redisConfiguration.host,
            port: Number(this.redisConfiguration.port),
        });
    }

    onApplicationShutdown() {
        this.redisClient.quit();
    }

    async insert(userId: number, tokenId: string): Promise<void> {
        await this.redisClient.set(this.getKey(userId), tokenId);
    }

    async validate(userId: number, tokenId: string): Promise<boolean> {
        const storedId = await this.redisClient.get(this.getKey(userId));
        return storedId === tokenId;
    }

    async invalidate(userId: number): Promise<void> {
        await this.redisClient.del(this.getKey(userId));
    }

    private getKey(userId: number): string {
        return `user-${userId}`;
    }
}
