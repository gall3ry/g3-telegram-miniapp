import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from 'database';

const db = new PrismaClient();

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
}
