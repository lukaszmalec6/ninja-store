
import {Module} from '@nestjs/common';
import {TokenStorageService} from './token-storage.service';
import {LoggerModule} from '../../_utils/logger';
import {ConfigModule} from '../../config';

@Module({
  imports: [LoggerModule, ConfigModule],
  providers: [TokenStorageService],
  exports: [TokenStorageService]
})
export class TokenStorageModule {}