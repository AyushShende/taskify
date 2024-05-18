import { Redis } from 'ioredis';
import { env } from '../config/serverEnvSchema';

export class InvalidatedRefreshTokenError extends Error {}

class RefreshTokenIdsStorage {
  private redisClient: Redis;
  constructor() {
    this.redisClient = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT
    });
  }

  getKey(userId: string): string {
    return `user-${userId}`;
  }

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedId === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }
}

export default new RefreshTokenIdsStorage();
