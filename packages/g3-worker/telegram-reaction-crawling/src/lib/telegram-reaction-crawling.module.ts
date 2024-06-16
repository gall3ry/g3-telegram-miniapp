import { PrismaClientModule } from '@g3-worker/prisma-client';
import { Module } from '@nestjs/common';
import { TelegramReactionCrawlingService } from './telegram-reaction-crawling.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [],
  providers: [TelegramReactionCrawlingService],
  exports: [TelegramReactionCrawlingService],
})
export class DataAccessInventoryModule {}
