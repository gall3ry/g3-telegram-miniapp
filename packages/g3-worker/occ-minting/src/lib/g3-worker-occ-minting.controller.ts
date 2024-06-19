import { InjectQueue } from '@nestjs/bull';
import { Controller, Logger, Post } from '@nestjs/common';
import { Queue } from 'bull';
import { OccMintingJobData, QUEUE_NAMES } from './constants';

@Controller('/occ-minting')
export class G3WorkerOccMintingController {
  constructor(
    @InjectQueue(QUEUE_NAMES.OCC_MINTING)
    private readonly occMintingQueue: Queue<OccMintingJobData>
  ) {}

  @Post('/mint')
  async mint() {
    Logger.log(this.occMintingQueue.client.status, 'Queue status');

    const data = await this.occMintingQueue.add(
      {
        foo: 'bar',
      },
      {
        jobId: Math.random().toString(36).substring(7),
      }
    );

    return {
      message: 'Minting started',
      data: data,
    };
  }
}
