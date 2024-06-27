import { PrismaClientModule } from '@g3-worker/prisma-client';
import { Module } from '@nestjs/common';
import { G3WorkerNftCrawlingService } from './g3-worker-nft-crawling.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [],
  providers: [G3WorkerNftCrawlingService],
})
export class G3WorkerNftCrawlingModule {}
