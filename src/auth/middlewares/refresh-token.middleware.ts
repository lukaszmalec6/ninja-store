
import {Injectable, UnauthorizedException, BadRequestException, NestMiddleware} from '@nestjs/common';
import {verify} from 'jsonwebtoken';
import {Request} from '../../_utils/request';
import {User} from '../../user/user.model';
import {IJwtPayload} from '../interfaces/jwt-payload.interface';
import {ConfigService} from '../../config/config.service';
import {TokenStorageService} from '../token-storage/token-storage.service';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {

  private readonly refreshTokenSecret: string;

  constructor(
    private readonly config: ConfigService,
    private readonly tokenRepo: TokenStorageService
  ) {
    this.refreshTokenSecret = this.config.get(`REFRESH_TOKEN_SECRET`);
  }
  /*
    Refreshing access token using refresh token:
    - find and verify refresh token in req headers
    - check if refresh token exists in token storage
    - success: pass user information to controller function
    - failure: throw error
  */
  use = async (req: Request, res: Response, next: Function) => {
    const {headers} = req;
    if (!headers[`authorization`] || headers[`authorization`].split(` `)[0] !== `Bearer`) {
      throw new BadRequestException(`Invalid Authorization header`);
    }
    const refreshToken = headers[`authorization`].split(` `)[1]
    if (!refreshToken) {
      throw new BadRequestException(`Refresh token not found`);
    }
    try {
      const payload = verify(refreshToken, this.refreshTokenSecret) as IJwtPayload;
      if (refreshToken !== await this.tokenRepo.getRefreshToken(payload.userId, payload.sessionKey)) {
        throw new BadRequestException(`Your refresh token has been revoked`);
      }
      req.user = new User({
        id: payload.userId
      });
      req.sessionKey = payload.sessionKey;
      next();
    } catch (error) {
      if (error.name === `TokenExpiredError`) {
        throw new UnauthorizedException(`Refresh token has expired`);
      }
      throw new UnauthorizedException(error.message);
    }
  }
}