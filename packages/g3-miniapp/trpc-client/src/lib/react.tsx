'use client';

import { useAuth } from '@gall3ry/g3-miniapp-global-store';
import { type AppRouter } from '@gall3ry/g3-miniapp-server';
import { ErrorMessage } from '@gall3ry/types';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {
  loggerLink,
  TRPCClientError,
  unstable_httpBatchStreamLink,
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { useState } from 'react';
import SuperJSON from 'superjson';

const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (err) => {
        if (
          err instanceof TRPCClientError &&
          err.shape?.data?.code === 'UNAUTHORIZED' &&
          err.shape?.message === ErrorMessage.UserNotFound &&
          useAuth.getState().accessToken !== undefined
        ) {
          useAuth.setState({ accessToken: undefined });
        }
      },
    }),

    defaultOptions: {
      queries: {
        retry: 0,
        staleTime: 2000,
      },
    },
  });

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + '/api/trpc',
          headers: () => {
            const headers = new Headers();
            headers.set('x-trpc-source', 'nextjs-react');
            headers.set(
              'authorization',
              `Bearer ${useAuth.getState().accessToken}`
            );
            return headers;
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
