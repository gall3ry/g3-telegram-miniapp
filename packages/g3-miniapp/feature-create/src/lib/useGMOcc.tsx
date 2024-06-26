'use client';
import { api } from '@gall3ry/g3-miniapp-trpc-client';

export const useGMOcc = () => {
  return api.occ.getOcc.useSuspenseQuery();
};
