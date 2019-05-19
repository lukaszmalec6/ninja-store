import {Controller, Get} from '@nestjs/common';
import {DbService} from './db.service';

@Controller(`db-test`)
export class DbTestController {
  constructor(private readonly dbService: DbService) {}

  @Get(`seed`)
  public async seed(): Promise<void> {
    return this.dbService.seed();
  }
}
