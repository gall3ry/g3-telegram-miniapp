'use client';
import { LoggedUserOnly } from '@gall3ry/g3-miniapp-authentication';
import { Spinner } from '@radix-ui/themes';
import { memo, Suspense } from 'react';
import { MintOCC } from './MintOcc';
import { TopSection } from './TopSection';

const Page = memo(() => {
  return (
    <div>
      <TopSection />
      <MintOCC />
    </div>
  );
});

Page.displayName = 'Page';

function PageWrapper() {
  return (
    <Suspense fallback={<Spinner mx="auto" />}>
      <LoggedUserOnly>
        <Page />
      </LoggedUserOnly>
    </Suspense>
  );
}

export { PageWrapper as Page };
