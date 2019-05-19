import {Module} from '@nestjs/common';
import {AdminDailyReport} from './daily-admin-raport.schedule';
import {ScheduleModule as NestSchedule} from 'nest-schedule';
import {LoggerModule} from '../_utils/logger';
import {EmailSenderModule} from '../_utils/email-sender';
import {OrderModule} from '../order';
@Module({
  imports: [
    LoggerModule,
    EmailSenderModule,
    OrderModule,
    NestSchedule.register()
  ],
  providers: [AdminDailyReport],
})
export class ScheduleModule {}
