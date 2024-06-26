'use client';
import { LoggedUserOnly } from '@gall3ry/g3-miniapp-authentication';
import { Spinner } from '@radix-ui/themes';
import { memo, Suspense } from 'react';
import { ForMintedOccPage } from './ForMintedOccPage';
import { Introduction } from './Introduction';
import { MintEPICButton } from './MintEPICButton';
import { useGMOcc } from './useGMOcc';

const Page = memo(() => {
  const [occ] = useGMOcc();

  return occ ? (
    <ForMintedOccPage />
  ) : (
    <>
      <Introduction />
      <MintEPICButton />
    </>
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
