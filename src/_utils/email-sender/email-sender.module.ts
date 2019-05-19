import {Module} from '@nestjs/common';
import {EmailSenderService} from './email-sender.service';
import {MailerModule} from '@nest-modules/mailer';
import {LoggerModule} from '../logger/logger.module';
import {ConfigModule, ConfigService} from '../../config';


@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get(`EMAIL_HOST`),
          port: +config.get(`EMAIL_PORT`),
          secure: !!config.get(`EMAIL_SECURE`),
          auth: {
            user: config.get(`EMAIL_USER`),
            pass: config.get(`EMAIL_PASS`)
          },
        },
        defaults: {
          from: 'Ninja Store',
        }
      })
    })],
  providers: [EmailSenderService],
  exports: [EmailSenderService]
})
export class EmailSenderModule {}