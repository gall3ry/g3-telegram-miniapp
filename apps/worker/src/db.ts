import { PrismaClient } from 'database';

export const db = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
});
