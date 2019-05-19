import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user';
import {AuthModule} from './auth';
import {ProductModule} from './product';
import {OrderModule} from './order';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    UserModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
