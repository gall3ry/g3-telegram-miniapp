import { Injectable } from '@nestjs/common';

@Injectable()
export class SampleModuleService {
  getHello(): string {
    return 'Hello World!';
  }
}
