'use client';

import { env } from '@gall3ry/g3-miniapp-env';
import { TRPCReactProvider } from '@gall3ry/g3-miniapp-trpc-client';
import { SDKProvider } from '@tma.js/sdk-react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { posthog } from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { BackendAuthProvider } from './BackendAuthProvider';

if (typeof window !== 'undefined') {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    loaded: function (ph) {
      if (env.NEXT_PUBLIC_G3_ENV === 'development') {
        console.log(`Removing PostHog session recording`);
        ph.opt_out_capturing(); // opts a user out of event capture
        ph.set_config({ disable_session_recording: true });
      }
    },
  });
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      env.NEXT_PUBLIC_G3_ENV !== 'production'
    ) {
      void import('eruda').then(({ default: eruda }) => eruda.init());
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <TRPCReactProvider>
        <SDKProvider acceptCustomStyles>
          <BackendAuthProvider>
            {children}

            <ProgressBar color="#14DB60" />
          </BackendAuthProvider>
        </SDKProvider>
      </TRPCReactProvider>
    </PostHogProvider>
  );
};
