import {Injectable, UnauthorizedException, BadRequestException} from '@nestjs/common';
import {use} from 'passport';
import {Strategy} from 'passport-local';
import {createHmac} from 'crypto';
import {UserSerivce} from '../../user/user.service';
import {JWTStrategySymbols} from './jwt.strategy.symbols';
import {Request} from '../../_utils/request';
import {ConfigService} from '../../config/config.service';
import {EmailSenderService} from '../../_utils/email-sender';

@Injectable()
export class LocalStrategy {

  private readonly salt: string;

  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserSerivce,
    private readonly emailSernder: EmailSenderService
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
        await this.emailSernder.sendPostRegisterEmail({email: user.email, userName: user.firstName});
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
        const user = await this.userService.getFull({email})
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
