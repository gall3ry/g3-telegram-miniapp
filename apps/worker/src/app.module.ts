import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service.js';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
