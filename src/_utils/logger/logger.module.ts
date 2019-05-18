import {Module, Logger as NestLogger, Injectable} from '@nestjs/common';

@Injectable()
export class Logger extends NestLogger {
  public info(context: string = `System`, message: string, ...values: Object[] | number[] | boolean[]): void {
    super.log(`${message}: ${JSON.stringify(values)}`, context);
  }

  public err(context: string, message: string, error: any): void {
    super.error(message, error.stack , context);
  }
}

@Module({
  providers: [Logger],
  exports: [Logger]
})
export class LoggerModule {}

