import {Injectable} from '@nestjs/common';
import * as redis from 'redis';
import * as util from 'util';
import {RedisKeyPrefix, IRedisClient} from './interfaces/token-storage.interfaces';

@Injectable()
export class TokenStorageService {
  private readonly client: IRedisClient;

  constructor() {
    try {
      this.client = redis.createClient();
      this.client.get = util.promisify(this.client.get).bind(this.client);
      this.client.set = util.promisify(this.client.set).bind(this.client);
      this.client.scan = util.promisify(this.client.scan).bind(this.client);
      this.client.del = util.promisify(this.client.del).bind(this.client);
    } catch (error) {
      throw new Error(`Creating redis client failed: ${error}`)
    }
  }

  public async saveTokens(userId: string, accessToken: string, refreshToken: string, sessionKey: string): Promise<void> {
    try {
      await this.client.set(this.getKey(RedisKeyPrefix.accessToken, userId, sessionKey), accessToken);
      await this.client.set(this.getKey(RedisKeyPrefix.refreshToken, userId, sessionKey), refreshToken);
    } catch (error) {
      throw new Error(`Error while saving access tokens for user id: ${userId}, ${error}`);
    }
  }

  public async getAccessToken(userId: string, sessionKey: string): Promise<string> {
    try {
      return await this.client.get(this.getKey(RedisKeyPrefix.accessToken, userId, sessionKey));
    } catch (error) {
      throw new Error(`Error while getting access token for user id: ${userId}, ${error}`);
    }
  }

  public async getRefreshToken(userId: string, sessionKey: string): Promise<string> {
    try {
      return await this.client.get(this.getKey(RedisKeyPrefix.refreshToken, userId, sessionKey));
    } catch (error) {
      throw new Error(`Error while getting refresh token for user id: ${userId}, ${error}`);
    }
  }

  public async deleteTokens(userId: string, sessionKey: string): Promise<{deletedCount: number}> {
    try {
      return {
        deletedCount:
          await this.client.del(this.getKey(RedisKeyPrefix.accessToken, userId, sessionKey)) +
          await this.client.del(this.getKey(RedisKeyPrefix.refreshToken, userId, sessionKey))
      };
    } catch (error) {
      throw new Error(`Error while deleting tokens for user id: ${userId}, ${error}`);
    }
  }

  private getKey(prefix: RedisKeyPrefix, userId: string, sessionKey: string): string {
    return `${prefix}:${userId}:${sessionKey}`;
  }

}
