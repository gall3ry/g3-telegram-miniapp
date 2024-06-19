import { Home } from '@gall3ry/g3-miniapp-feature-home';
import { Suspense } from 'react';

export default function Wrapper() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
