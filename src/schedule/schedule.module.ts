import {Module} from '@nestjs/common';
import {AdminDailyReport} from './daily-admin-raport.schedule';
import {ScheduleModule as NestSchedule} from 'nest-schedule';
import {LoggerModule} from '../_utils/logger';
import {EmailSenderModule} from '../_utils/email-sender';
import {OrderModule} from '../order';
import {ConfigModule} from '../config';
@Module({
  imports: [
    LoggerModule,
    EmailSenderModule,
    OrderModule,
    ConfigModule,
    NestSchedule.register()
  ],
  providers: [AdminDailyReport],
})
export class ScheduleModule {}
