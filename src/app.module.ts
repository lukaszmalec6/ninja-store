import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user';
import {AuthModule} from './auth';
import {ProductModule} from './product';
import {OrderModule} from './order';
import {ScheduleModule} from './schedule';
@Module({
  imports: [
    AuthModule,
    ProductModule,
    UserModule,
    OrderModule,
    ScheduleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
