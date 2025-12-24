import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: 3,
    });

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  // Hash operations for storing patient status
  async hSet(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value);
  }

  async hGet(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hDel(key: string, field: string): Promise<number> {
    return this.client.hdel(key, field);
  }

  async hExists(key: string, field: string): Promise<number> {
    return this.client.hexists(key, field);
  }

  // Set operations for indexing
  async sAdd(key: string, member: string): Promise<number> {
    return this.client.sadd(key, member);
  }

  async sRem(key: string, member: string): Promise<number> {
    return this.client.srem(key, member);
  }

  async sMembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  // Key operations
  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }
}
