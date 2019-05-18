import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {authenticate} from 'passport';
import {LocalStrategy} from './passport/local.strategy';
import {JwtStrategy} from './passport/jwt.strategy';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {bodyValidator} from '../_utils/middlewares';
import {registerSchema} from './validators/register.schema';
import {loginSchema} from './validators/login.schema';
import {JWTStrategySymbols} from './passport/jwt.strategy.symbols';
import {RefreshTokenMiddleware} from './middlewares/refresh-token.middleware';
import {ConfigModule} from '../config/config.module';
import {UserModule} from '../user/user.module';
import {TokenStorageModule} from './token-storage/token-storage';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    TokenStorageModule
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        bodyValidator(registerSchema),
        authenticate(JWTStrategySymbols.register, {session: false})
      ).forRoutes('auth/register')
      .apply(
        bodyValidator(loginSchema),
        authenticate(JWTStrategySymbols.login, {session: false})
      ).forRoutes('auth/login')
      .apply(
        RefreshTokenMiddleware
      ).forRoutes('auth/refresh')
  }
}
