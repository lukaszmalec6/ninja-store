import {Injectable} from '@nestjs/common';
import {MailerService, ISendMailOptions} from '@nest-modules/mailer';
import {Logger} from '../logger';

@Injectable()
export class EmailSenderService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: Logger,
  ) {}

  public async sendPostRegisterEmail(data: {email: string, userName: string}): Promise<void> {
    this.sendEmail({
      to: data.email,
      subject: `Welcome to Ninja Store.`,
      text: `
        Welcome to NinjaStore, ${data.userName}!
      `
    });
  }

  public async sendPostOrderEmail(data: {email: string, userName: string, price: number, product: string}): Promise<void> {
    this.sendEmail({
      to: data.email,
      subject: `Order confirmation`,
      text: `
          Hello ${data.userName}! You have bought a ${data.product} for ${data.price} ninjollar$.
      `
    });
  }

  private async sendEmail(options: ISendMailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail(options)
      this.logger.info(`Mailer`, `Email sent`, options);
    } catch (error) {
      this.logger.err(`Mailer`, `Error while sendning email ${JSON.stringify(options)}, ${error.message}`, error);
    }
  }
}