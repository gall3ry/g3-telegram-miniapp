import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OccMintingJobData, QUEUE_NAMES } from './constants';

@Processor(QUEUE_NAMES.OCC_MINTING)
export class G3WorkerOccMintingProcessor {
  private readonly logger = new Logger(G3WorkerOccMintingProcessor.name);

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`
    );
  }

  @OnQueueWaiting()
  onWaiting(jobId: number) {
    console.log(`Waiting for job ${jobId}...`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(
      `Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}...`
    );
  }

  @OnQueueFailed()
  onError(job: Job<OccMintingJobData>, error: Error) {
    console.log(
      `Failed job ${job.id} of type ${job.name} with error ${error.message}...`
    );
  }

  @Process()
  async handleTranscode(job: Job<OccMintingJobData>) {
    this.logger.debug('Start minting...');
    this.logger.debug(job.data);
    this.logger.debug('Minting completed');

    await job.progress(100);

    return {
      message: 'Minting completed',
    };
  }
}
