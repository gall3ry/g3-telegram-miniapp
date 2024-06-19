import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QUEUE_NAMES } from './constants';
import { G3WorkerOccMintingController } from './g3-worker-occ-minting.controller';
import { G3WorkerOccMintingProcessor } from './g3-worker-occ-minting.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.OCC_MINTING,
    }),
  ],
  providers: [G3WorkerOccMintingProcessor],
  controllers: [G3WorkerOccMintingController],
})
export class G3WorkerOccMintingModule {}
