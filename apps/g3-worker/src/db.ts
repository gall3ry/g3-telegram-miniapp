import { PrismaClient } from '@database/database-client';

export const db = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
});
