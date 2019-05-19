import {Injectable} from '@nestjs/common';
import {MailerService, ISendMailOptions} from '@nest-modules/mailer';
import {Logger} from '../logger';
import {IAdminReportData} from '../../order';
import * as Pdfkit from 'pdfkit';
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

  public async sendAdminReportEmail(data: {email: string, reportData: IAdminReportData}): Promise<void> {
    try {
      const pdf = new Pdfkit();
      let buffers = [];
      pdf.on(`data`, (data) => buffers.push(data));
      pdf.on(`end`, async () => {
        let pdfData = Buffer.concat(buffers);
        await this.sendEmail({
          to: `admin@admin.com`,
          subject: `Daily report.`,
          text: `
            Good morning mr Admin. Here's report for yesterday (check attachments).
          `,
          attachments: [{
            filename: `report.pdf`,
            content: pdfData,
            contentType: `application/pdf`
          }]
        }, `Daily admin's report sent`)
      });
      this.preparePdf(pdf, data.reportData);
      pdf.end();
    } catch (error) {
      throw new Error(`Can't prepare daily report email: ${error}`);
    }
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

  private async sendEmail(options: ISendMailOptions, customMesasge?: string): Promise<void> {
    try {
      await this.mailerService.sendMail(options)
      this.logger.info(`Mailer`, customMesasge || `Email sent`, !!customMesasge ? `` : options);
    } catch (error) {
      throw new Error(`Error while sendning email ${JSON.stringify(options)}: ${error.message}`);
    }
  }

  private preparePdf(pdf: Pdfkit, data: IAdminReportData): Pdfkit {
    try {
      const today = new Date();
      let yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      pdf.fontSize(8);
      pdf.text(today.toDateString(), {align: `right`});
      pdf.moveDown();
      pdf.fontSize(14);
      pdf.text(`Daily report from NinjaStore for ${yesterday.toDateString()}`, {align: `center`, underline: true});
      pdf.moveDown();
      pdf.fontSize(12);
      pdf.text(`Items sold: ${data.totalSoldCount}`);
      pdf.moveDown();
      pdf.text(`Total earnings: ${data.earningsCount.toFixed(2)}$`);
      pdf.moveDown();
      pdf.text(`Yesterday's bestsellers:`);
      pdf.moveDown();
      data.bestsellers.forEach(bestseller => {
        pdf.fontSize(10);
        pdf.text(`Product name: ${bestseller.name}`, {indent: 20})
        pdf.moveDown();
        pdf.text(`Sold ${bestseller.soldCount} times for total earinngs equal: ${bestseller.moneyGained}$`, {indent: 40})
        pdf.moveDown();
      })
      pdf.moveDown();
      pdf.text(`Cheers! NinjaStore`, {align: `right`});
      pdf.moveDown();
      return pdf;
    } catch (error) {
      throw new Error(`Error while preparing pdf file for daily report: ${error.message}`);
    }
  }
}