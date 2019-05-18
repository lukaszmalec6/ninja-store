import {Injectable} from '@nestjs/common';
import {sign} from 'jsonwebtoken';
import {IToken} from './interfaces/token.interface';
import {ConfigService} from '../config/config.service';
import {TokenStorageService} from './token-storage/token-storage.service';
import * as uuid from 'uuid';

@Injectable()
export class AuthService {

  private readonly accessTokenExpiresIn: string;
  private readonly accessTokenSecret: string;

  private readonly refreshTokenExpiresIn: string;
  private readonly refreshTokenSecret: string;

  constructor(
    private readonly config: ConfigService,
    private readonly tokenRepo: TokenStorageService
  ) {
    this.accessTokenExpiresIn = this.config.get('ACCESS_TOKEN_EXPIRES_IN');
    this.accessTokenSecret = this.config.get('ACCESS_TOKEN_SECRET');
    this.refreshTokenExpiresIn = this.config.get('REFRESH_TOKEN_EXPIRES_IN');
    this.refreshTokenSecret = this.config.get('REFRESH_TOKEN_SECRET');
  }

  public async createToken(userId: string): Promise<IToken> {
    const sessionKey = uuid.v4();
    const accessToken = sign({userId, sessionKey}, this.accessTokenSecret, {expiresIn: this.accessTokenExpiresIn});
    const refreshToken = sign({userId, sessionKey}, this.refreshTokenSecret, {expiresIn: this.refreshTokenExpiresIn});
    await this.tokenRepo.saveTokens(userId, accessToken, refreshToken, sessionKey);
    return {accessToken, refreshToken};
  }

  public async deleteTokens(userId: string, sessionKey: string): Promise<boolean> {
    try {
      await this.tokenRepo.deleteTokens(userId, sessionKey);
      return true;
    } catch (error) {
      return false;
    }

  }
}
