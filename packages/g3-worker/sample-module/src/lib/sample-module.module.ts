import { Module } from '@nestjs/common';
import { SampleModuleService } from './sample-module.service';

@Module({
  providers: [SampleModuleService],
})
export class SampleModuleModule {}
