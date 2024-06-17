import { PrismaClient } from '@gall3ry/shared/database-client';

export const db = new PrismaClient({
  log: [],
});
