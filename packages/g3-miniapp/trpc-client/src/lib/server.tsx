import 'server-only';

import { createCaller, createTRPCContext } from '@gall3ry/g3-miniapp-server';
import { headers } from 'next/headers';
import { cache } from 'react';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    headers: heads,
  });
});

// TODO: Since we use localStorage, so beware that this api doesn't work in SSR
export const api = createCaller(createContext);
