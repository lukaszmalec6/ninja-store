import {Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from './auth.service';
import {IToken} from './interfaces/token.interface';
import {JWTStrategySymbols} from './passport/jwt.strategy.symbols';
import {Request} from '../request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  public async register(@Req() req: Request): Promise<IToken> {
    return await this.authService.createToken(req.user.id);
  }

  @Post('login')
  public async login(@Req() req: Request): Promise<IToken> {
    return await this.authService.createToken(req.user.id);
  }

  @Post('refresh')
  public async refreshToken(@Req() req: Request): Promise<IToken> {
    await this.authService.deleteTokens(req.user.id, req.sessionKey);
    return await this.authService.createToken(req.user.id);
  }

  @Post('logout')
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt))
  public async logout(@Req() req: Request): Promise<boolean> {
    return await this.authService.deleteTokens(req.user.id, req.sessionKey);
  }

}
