import { PrismaClient } from '@g3-miniapp-v2/database-client';

export const db = new PrismaClient({
  log: [],
});
