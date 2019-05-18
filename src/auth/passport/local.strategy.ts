import {Injectable, UnauthorizedException, BadRequestException} from '@nestjs/common';
import {use} from 'passport';
import {Strategy} from 'passport-local';
import {createHmac} from 'crypto';
import {UserSerivce} from '../../user/user.service';
import {JWTStrategySymbols} from './jwt.strategy.symbols';
import {Request} from '../../request';
import {ConfigService} from '../../config/config.service';

@Injectable()
export class LocalStrategy {

  private readonly salt: string;

  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserSerivce
  ) {
    this.salt = this.config.get('SALT');
    this.init();
  }

  private generateHashedPassword(salt: string, password: string): string {
    return createHmac('sha256', salt).update(password).digest('hex');
  };

  private init(): void {
    /*
      Register
    */
    use(JWTStrategySymbols.register, new Strategy({
      usernameField: `email`,
      passwordField: `password`,
      passReqToCallback: true
    }, async (req: Request, email: string, password: string, done: Function) => {
      try {
        const {firstName, lastName} = req.body;
        const hash = this.generateHashedPassword(password, this.salt);
        const user = await this.userService.create({firstName, lastName, email, password: hash});
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }));

    /*
      Login
    */
    use(JWTStrategySymbols.login, new Strategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email: string, password: string, done: Function) => {
      try {
        const user = await this.userService.get({email})
        if (!user) {
          return done(new UnauthorizedException(`Email not found`), false);
        }

        const hash = this.generateHashedPassword(password, this.salt);
        if (hash !== user.password) {
          return done(new UnauthorizedException(`Wrong password`), false);
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }));
  }
}
