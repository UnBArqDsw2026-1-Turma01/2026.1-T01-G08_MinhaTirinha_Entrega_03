import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoricModule } from './historic/historic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HistoricModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
