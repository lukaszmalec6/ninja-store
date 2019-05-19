import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user';
import {AuthModule} from './auth';
import {ProductModule} from './product';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
