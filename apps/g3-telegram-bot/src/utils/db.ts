import { PrismaClient } from '@gall3ry/database-client';

export const db = new PrismaClient({
  log: [],
});
