import {Module} from '@nestjs/common';
import {UserModule} from './user';
import {AuthModule} from './auth';
import {ProductModule} from './product';
import {OrderModule} from './order';
import {ScheduleModule} from './schedule';
import {DBModule} from './_utils/db';
@Module({
  imports: [
    DBModule,
    AuthModule,
    ProductModule,
    UserModule,
    OrderModule,
    ScheduleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
