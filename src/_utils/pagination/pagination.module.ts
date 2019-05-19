import {Module} from '@nestjs/common';
import {ConfigModule} from '../../config';
import {PaginationService} from './pagination.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [PaginationService],
  exports: [PaginationService]
})
export class PaginationModule {}
