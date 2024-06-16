import { PrismaClient } from '@g3-miniapp-v2/shared/database-client';

export const db = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
});
