import {Injectable} from '@nestjs/common';
import {Cron, NestSchedule} from 'nest-schedule';
import {Logger} from '../_utils/logger';
import {EmailSenderService} from '../_utils/email-sender';
import {OrderService} from '../order';
import {ConfigService} from '../config';

@Injectable()
export class AdminDailyReport extends NestSchedule {

  constructor(
    private readonly logger: Logger,
    private readonly emailSender: EmailSenderService,
    private readonly orderService: OrderService,
    private readonly configService: ConfigService
  ) {
    super();
  }
  /*
    run every dat at 8:00
  */
  @Cron(`0 8 * * *`)
  public async sendAdminReport(): Promise<void> {
    try {
      const adminEmail = this.configService.get(`ADMIN_EMAIL`);
      const reportData = await this.orderService.getAdminReportData();
      await this.emailSender.sendAdminReportEmail({email: adminEmail, reportData});
      this.logger.info(`Scheduler`, `Sending daily report to admin`);
    } catch (error) {
      throw new Error(`Can't send daily admin report: ${error.message}`)
    }
  }


}