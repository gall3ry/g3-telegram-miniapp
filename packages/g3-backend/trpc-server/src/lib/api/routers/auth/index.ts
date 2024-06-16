import { createTRPCRouter } from '../../trpc';
import { checkProof } from './checkProof';
import { generatePayload } from './generatePayload';
import { getCurrentUser } from './getCurrentUser';
import { getMyStats } from './getMyStats';
import { updateDisplayName } from './updateDisplayName';

export const authRouter = createTRPCRouter({
  checkProof: checkProof,
  generatePayload: generatePayload,
  getCurrentUser: getCurrentUser,
  updateDisplayName,
  getMyStats,
});
